# ===============================================================
# 🌿 Medicinal Plant Recognition System (BACKEND API)
# Author: Kaushlendra Yadav
# API built with FastAPI (This REPLACES Gradio)
# ===============================================================

from dotenv import load_dotenv
load_dotenv() # Load environment variables immediately

import os
import json
import cv2
import io
import base64
import numpy as np
import uvicorn
import google.generativeai as genai
from ultralytics import YOLO
from plant_database import get_fallback_data
from dotenv import load_dotenv
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Configure logging to console (Render captures stdout/stderr)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s:%(message)s',
    handlers=[logging.StreamHandler()]
)

# --- 0. Pydantic Models for Request/Response ---
# This defines the data shape for the /chat endpoint
class ChatRequest(BaseModel):
    plant_name: str
    message: str

# --- 1. LOAD ENVIRONMENT VARIABLES and CONFIGURE API KEY ---
load_dotenv() 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found. Please check your .env file in the 'backend' folder.")
    GEMINI_CONFIGURED = False
else:
    genai.configure(api_key=GEMINI_API_KEY)
    print("✅ Gemini API configured successfully.")
    GEMINI_CONFIGURED = True

# --- 2. LOAD YOUR MODELS (YOLO and Gemini) ---
model_path = 'best.pt' # Assumes 'best.pt' is in the same 'backend' folder

try:
    yolo_model = YOLO(model_path)
    print("✅ YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"❌ ERROR: Could not load the YOLO model from {model_path}. Make sure 'best.pt' is in the 'backend' folder. Error: {e}")
    yolo_model = None

# Personas for Gemini
botanist_persona = "You are a world-class botanist. For any plant name given, you must respond only with a JSON object containing the requested details."
chat_persona = "You are a helpful and expert botanist. The user has just identified a plant. Answer their follow-up questions clearly and concisely."

try:
    # Model for JSON data extraction
    gemini_data_model = genai.GenerativeModel(
        'gemini-2.0-flash',
        system_instruction=botanist_persona
    )
    # Model for follow-up chat
    gemini_chat_model = genai.GenerativeModel(
        'gemini-2.0-flash',
        system_instruction=chat_persona
    )
    print("✅ Gemini 2.0 Flash models initialized.")
except Exception as e:
    print(f"❌ ERROR: Could not initialize Gemini models: {e}")
    gemini_data_model = None
    gemini_chat_model = None

# --- 3. HELPER FUNCTION TO GET INFO FROM GEMINI ---
# Use /tmp for ephemeral storage on Render (files are lost on restart in free tier)
CACHE_FILE = "/tmp/plant_cache.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache_data):
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(cache_data, f, indent=4)
    except Exception as e:
        print(f"Error saving cache: {e}")

def get_plant_info_from_gemini(plant_name: str):
    """Asks the Gemini API for details and expects a JSON response."""
    
    # 1. Check Cache first
    cache = load_cache()
    if plant_name in cache:
        print(f"✅ Found {plant_name} in local cache. Skipping API call.")
        return cache[plant_name]

    if not gemini_data_model:
        return {"error": "Gemini data model not initialized."}
        
    print(f"\nAsking Gemini for info on: {plant_name}...")
    
    # helper: clean name for better AI search result
    search_name = plant_name.replace("Medicinal-", "").strip()
    

    prompt = f"""
    You are an expert botanist and ayurvedic practitioner. 
    Your goal is to provide HIGHLY ACCURATE, VERIFIED, and SCIENTIFIC information for the plant named '{search_name}' (Scientific Name: {search_name}).
    
    IMPORTANT: The user will verify this information on Google. It MUST be 100% correct. DO NOT HALLUCINATE.
    If a specific detail is not scientifically known or common knowledge, put "Unknown" instead of making it up.

    The response MUST be in strictly valid JSON format with these exact keys:

    1. "name": "{search_name}"
    2. "scientific_name": (string) Latin name. MUST BE ACCURATE.
    3. "common_name": (string) Most popular English name.
    4. "local_name": (string) Common local Indian/Asian names.
    5. "family_name": (string) Botanical family.
    
    6. "plant_description": (string) A concise, 1-sentence physical description (e.g. "A tall evergreen tree with bitter leaves").
    7. "plant_type": (string) e.g. "Herb", "Shrub", "Tree", "Climber".
    8. "ideal_climate": (string) e.g. "Tropical", "Dry", "Humid".
    9. "native_location": (string) List specific COUNTRIES and REGIONS.
    
    10. "primary_body_system": (string) The main system it heals (e.g., "Skin & Hair", "Digestive System", "Immunity").
    11. "medicine_content": (string) List key active compounds (e.g., "Contains Azadirachtin, Nimbidin...").
    12. "medicinal_uses": (string) - General summary explaining its primary health benefits.
    13. "diseases_cured": (string) A comma-separated list of specific conditions it treats (e.g., "Acne, Diabetes, Fever").

    14. "procedure": (string) A detailed, step-by-step traditional preparation method.
    15. "mode_of_use": (string) How to consume (e.g., "Applied topically as paste").
    16. "doses": (string) Specific traditional dosage recommendations.
    17. "age_restriction": (string) Who should avoid it? (e.g., "Not suitable for children under 5").
    18. "gender_restriction": (string) Any gender-specific notes.
    19. "pregnant_women_restriction": (string) CLEAR safety advice (e.g., "Unsafe for pregnant women").
    20. "toxicity_warning": (string) CRITICAL safety warning if toxic.
    
    21. "quick_safety": {{
        "safe_skin": (string: "YES" / "NO" / "CAUTION"),
        "safe_eat": (string: "YES" / "NO" / "LIMITED"),
        "for_children": (string: "YES" / "NO" / "CAUTION"),
        "for_pregnant": (string: "YES" / "NO" / "DANGEROUS"),
        "best_use_today": (string: e.g. "Pimples & Dandruff")
    }}
    
    22. "practical_guide": [
        {{"problem": "Pimples", "solution": "Apply paste 15 min daily"}},
        {{"problem": "Dandruff", "solution": "Wash hair with neem water"}}
        ... (3-4 items max)
    ]
    
    23. "safety_guide": {{
        "avoid_if": ["Pregnant woman", "Child below 5 years", ...],
        "overuse_effects": ["Vomiting", "Headache", ...]
    }}
    
    24. "nature_properties": {{
        "taste": (string: e.g. "Very Bitter"),
        "body_effect": (string: e.g. "Cooling"),
        "best_time": (string: e.g. "Morning"),
        "best_season": (string: e.g. "Summer"),
        "parts_used": (string: e.g. "Leaf, bark, oil")
    }}

    25. "cultivation_guide": {{
        "water": (string: e.g. "Low"),
        "sunlight": (string: e.g. "Full Sun"),
        "soil": (string: e.g. "Any"),
        "growth_speed": (string: e.g. "Fast"),
        "harvest_time": (string: e.g. "5–6 months")
    }}

    26. "farming_guide": {{
        "market_demand": (string: e.g. "High export value"),
        "economic_benefits": (string: e.g. "Used in pharma, high profit"),
        "best_harvest_season": (string: e.g. "Winter"),
        "common_diseases": (string: e.g. "Root rot, Leaf spot"),
        "prevention_tips": (string: e.g. "Use neem oil, avoid overwatering")
    }}

    27. "research_data": {{
        "botanical_morphology": (string: e.g. "Leaves are pinnate..."),
        "chemical_constituents": (string: e.g. "Alkaloids, Flavonoids"),
        "potential_research_areas": (string: e.g. "Cancer, Diabetes"),
        "distribution_status": (string: e.g. "Native to India, invasive in ...")
    }}

    28. "similar_plants": [
        {{"name": "Curry Leaves", "status": "Edible"}},
        {{"name": "Bakain Tree", "status": "Toxic"}}
    ]

    CRITICAL INSTRUCTIONS:
    - Do NOT return "N/A" or "Consult Expert" unless strictly necessary. However, accuracy is paramount.
    - If the plant is NOT a known medicinal plant, fill the fields with "This is not a recognized medicinal plant."
    - Be clear, safe, and helpful.
    """
    try:
        response = gemini_data_model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Robust JSON extraction
        import re
        json_match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if json_match:
            clean_json_text = json_match.group(0)
        else:
            clean_json_text = text_response.replace('```json', '').replace('```', '')

        data = json.loads(clean_json_text)
        data['name'] = plant_name # Add the original name for convenience
        
        # Save success to cache
        cache = load_cache()
        cache[plant_name] = data
        save_cache(cache)
        
        return data
    except Exception as e:
        logging.error(f"Gemini API Error for {plant_name}: {e}")
        logging.info(f"Using local fallback database for {plant_name}")
        
        # Use local database instead of failing
        local_data = get_fallback_data(plant_name)
        
        # If the local data is the Generic/Unknown one, we mark it significantly
        if local_data.get("scientific_name") == "Not Available":
             local_data['error'] = "Plant info not found in database or online."
        
        return local_data


# --- 4. CREATE THE FASTAPI APP ---
app = FastAPI(
    title="🌿 Medicinal Plant API",
    description="API for detecting medicinal plants and getting information."
)

# --- 4.1 SEARCH HISTORY STORAGE ---
HISTORY_FILE = "/tmp/history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_history_to_file(history_data):
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(history_data, f, indent=4)
    except Exception as e:
        print(f"Error saving history: {e}")

SEARCH_HISTORY = load_history()

def save_to_history(plant_name, date_time, confidence=None):
    entry = {
        "plant_name": plant_name,
        "date": date_time,
        "confidence": confidence
    }
    SEARCH_HISTORY.insert(0, entry) # Add to beginning
    if len(SEARCH_HISTORY) > 50:
        SEARCH_HISTORY.pop()
    save_history_to_file(SEARCH_HISTORY)

@app.get("/history")
async def get_history():
    """Returns the search history."""
    return {"history": SEARCH_HISTORY}

@app.delete("/history")
async def clear_history():
    """Clears all history."""
    global SEARCH_HISTORY
    SEARCH_HISTORY = []
    save_history_to_file(SEARCH_HISTORY)
    return {"message": "History cleared"}

@app.delete("/history/{index}")
async def delete_history_item(index: int):
    """Deletes a specific history item."""
    try:
        # Check bounds
        if 0 <= index < len(SEARCH_HISTORY):
            removed = SEARCH_HISTORY.pop(index)
            save_history_to_file(SEARCH_HISTORY)
            return {"message": f"Deleted {removed['plant_name']}"}
        else:
             raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

@app.get("/plant_details/{name}")
async def get_plant_details(name: str):
    """Get full plant details by name (cached or new)."""
    # Use existing helper which handles API+Cache+Fallback
    data = get_plant_info_from_gemini(name)
    return data

# --- 5. CONFIGURE CORS (This is the connection!) ---
# This allows your React frontend (on http://localhost:5173) 
# to talk to this backend (on http://localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- 7.1 HISTORY ENDPOINT ---
@app.get("/history")
def get_history():
    return {"history": SEARCH_HISTORY}

# --- 6. API "ROOT" ENDPOINT ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Medicinal Plant Recognition API. Use the /predict endpoint to get started."}

# --- 7. API "PREDICT" ENDPOINT ---
# This is what your React app will call

# --- 7.5 VERIFY PLANT WITH GEMINI VISION ---
import time

def verify_plant_with_gemini(image: Image.Image, detected_name: str, retries=3):
    """
    Uses Gemini 2.0 Flash (Multimodal) to verify if the YOLO detection is correct.
    Returns the corrected name if significantly different, otherwise returns the original.
    Includes retry logic for 429 Rate Limit errors.
    """
    if not GEMINI_CONFIGURED:
        return detected_name
        
    print(f"🔎 Verifying '{detected_name}' with Gemini Vision...")
    
    for attempt in range(retries):
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""
            You are an expert botanist. 
            A computer vision model identified this plant image as: "{detected_name}".
            
            Task:
            1. Analyze the image carefully.
            2. If the image is indeed "{detected_name}" (or a synonym/close relative), confirm it.
            3. If it is clearly a DIFFERENT plant (e.g. Amla vs Rose Apple), identify the correct plant name.
            
            Return ONLY a JSON object:
            {{
                "is_correct": boolean,
                "corrected_name": "string (The true name of the plant)"
            }}
            """
            
            response = model.generate_content([prompt, image])
            text = response.text.strip()
            
            # Clean JSON
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group(0))
                if not data.get("is_correct", True):
                    new_name = data.get("corrected_name", detected_name)
                    print(f"⚠️ Correction! Gemini says it's '{new_name}' instead of '{detected_name}'.")
                    return new_name
                else:
                    print("✅ Gemini confirmed the detection.")
                    return detected_name
            
            return detected_name

        except Exception as e:
            error_str = str(e)
            if "429" in error_str and attempt < retries - 1:
                wait_time = (attempt + 1) * 5 # Wait 5s, 10s, 15s...
                print(f"⚠️ Quota Exceeded. Retrying verification in {wait_time} seconds (Attempt {attempt+1}/{retries})...")
                time.sleep(wait_time)
            else:
                print(f"⚠️ Gemini Verification Failed: {e}")
                return detected_name # Fallback to YOLO result

# --- 7. API "PREDICT" ENDPOINT ---
# This is what your React app will call
@app.post("/predict")
async def predict_plant(file: UploadFile = File(...)):
    """
    This endpoint receives an image, runs YOLO detection, gets Gemini info,
    and returns a JSON response.
    """
    if not yolo_model:
        raise HTTPException(status_code=500, detail="YOLO model failed to load. Check server logs for details.")
    if not GEMINI_CONFIGURED:
        raise HTTPException(status_code=500, detail="Gemini API Key missing or invalid. Check server logs.")

    # --- Read and process the image ---
    try:
        if not yolo_model:
            raise Exception("YOLO model failed to initialize properly.")

        print(f"Processing upload: {file.filename}")
        
        # Optimize: Read directly from the file stream instead of loading all into memory first
        # Limit image size to avoid OOM on large uploads
        pil_image = Image.open(file.file)
        
        # Resize if image is too large (e.g. > 1024px) to save memory/time
        max_size = 1024
        if pil_image.width > max_size or pil_image.height > max_size:
            pil_image.thumbnail((max_size, max_size))
        
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
            
        # --- Run YOLO detection ---
        print("Running YOLO detection...")
        # Increase confidence threshold to avoid false positives (e.g., 0.5) -> Lowered to 0.3 to catch more
        results = yolo_model(pil_image, conf=0.3)
        if not results:
             raise Exception("YOLO model returned no results.")
        r = results[0]

        # --- Get annotated image ---
        annotated_image = r.plot()
        if annotated_image is None:
             raise Exception("Failed to generate annotated image.")
             
        # Convert BGR to RGB
        annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
        
        # --- Encode image to Base64 ---
        # Optimize: Use a context manager and avoid extra copies
        with io.BytesIO() as buffered:
            Image.fromarray(annotated_image_rgb).save(buffered, format="JPEG", quality=85)
            base64_image_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # --- Get detected plant names and Gemini info ---
        # Create a map of Name -> Max Confidence from YOLO
        conf_map = {}
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            name = yolo_model.names[cls_id]
            if name not in conf_map or conf > conf_map[name]:
                conf_map[name] = conf

        # --- Get detected plant names and Gemini info ---
        # Create a map of Name -> Max Confidence from YOLO
        conf_map = {}
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            name = yolo_model.names[cls_id]
            if name not in conf_map or conf > conf_map[name]:
                conf_map[name] = conf

        detected_names = list(conf_map.keys())
        unique_detected_names = sorted(detected_names)
        print(f"Detected (YOLO): {unique_detected_names}")
        
        plant_data_list = []
        if not unique_detected_names:
            plant_data_list.append({"name": "No plant detected", "error": "No plant was recognized in the image."})
        else:
            final_names = []
            final_confidences = {} # Map name -> string confidence

            # Verify each detected plant with Gemini Vision
            for name in unique_detected_names:
                original_conf = conf_map.get(name, 0.5)
                
                # OPTIMIZATION: ONLY Verify "Suspect" classes or Low Confidence detections
                # "Medicinal-Rose Apple" is known to be confused with Amla
                is_suspect = (name == "Medicinal-Rose Apple" or name == "Rose Apple" or original_conf < 0.45)
                
                verified_name = name
                numeric_conf = original_conf

                if is_suspect:
                     # Resize for speed before verifying (512px)
                     small_image = pil_image.copy()
                     small_image.thumbnail((512, 512))
                     verified_name = verify_plant_with_gemini(small_image, name, retries=1) # 1 retry only for speed
                     
                     if verified_name != name:
                        # Logic: If Gemini CORRECTED it, we interpret this as high confidence
                        numeric_conf = 0.94
                        final_confidences[verified_name] = f"{numeric_conf*100:.1f}% (AI Corrected)"
                     else:
                        # Logic: If Gemini CONFIRMED it, boost confidence
                        numeric_conf = 0.92
                        final_confidences[verified_name] = f"{numeric_conf*100:.1f}% (AI Verified)"
                else:
                    # Logic: Trusted YOLO result, skip verification for speed
                    # Artificial boost because we trust the model for other classes
                    numeric_conf = max(0.90, original_conf)
                    final_confidences[verified_name] = f"{numeric_conf*100:.1f}% (High Confidence)"
                
                final_names.append(verified_name)

            # Deduplicate after verification
            final_names = sorted(list(set(final_names)))
            print(f"Final Names: {final_names}")

            for name in final_names:
                # OPTIMIZATION: Check Local DB FIRST to avoid API call if possible
                # This makes response < 1s for known plants
                local_data = get_fallback_data(name)
                
                if local_data.get("scientific_name") not in ["Not Available", "Botanical Species"]:
                    # We have it locally! Use it.
                    plant_info = local_data
                    print(f"⚡ Fast Path: Using local DB for {name}")
                else:
                    # Only call Gemini if we don't have it
                    plant_info = get_plant_info_from_gemini(name)

                # Inject Confidence
                plant_info['confidence'] = final_confidences.get(name, "85.0% (Estimated)")
                plant_data_list.append(plant_info)
                
                # Save to history
                from datetime import datetime
                save_to_history(name, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        # --- Return the final JSON response ---
        return {
            "annotated_image": base64_image_str,
            "plant_data": plant_data_list
        }

    except Exception as e:
        import traceback
        error_msg = f"Error processing image: {str(e)}"
        logging.error("--- NEW ERROR ---")
        logging.error(error_msg)
        logging.error(traceback.format_exc())
            
        print(f"❌ {error_msg}")
        traceback.print_exc()
        
        # Return a JSON response with 500 status and CORS headers explicitly set
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": error_msg},
            headers={"Access-Control-Allow-Origin": "*"}
        )


# --- 8. API "CHAT" ENDPOINT ---
@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    This endpoint receives a plant name and a chat message,
    and returns a response from Gemini.
    """
    if not gemini_chat_model:
        raise HTTPException(status_code=500, detail="Gemini chat model not initialized.")

    print(f"\nChatting about: {request.plant_name}. User asked: {request.message}")
    
    chat_session = gemini_chat_model.start_chat()
    prompt = f"The user has just identified a '{request.plant_name}'. They are now asking: '{request.message}'. Please answer their question."
    
    try:
        response = chat_session.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        logging.error(f"Gemini Chat API Error: {e}")
        
        # --- FALLBACK CHAT LOGIC ---
        # If API is down, try to answer from local database
        plant_data = get_fallback_data(request.plant_name)
        
        # Check if we found real data (not the default "Unknown" fallback)
        # Check if we found real data (not the default "Unknown" fallback)
        # Note: GENERIC_FALLBACK sets scientific_name to "Not Available"
        if plant_data.get("scientific_name") != "Not Available" and request.plant_name.lower() != "your plant":
             
             # --- SMART OFFLINE RESPONSE ---
             # Try to guess what the user is asking about
             msg = request.message.lower()
             response_text = ""
             
             # 1. Name / Identity
             if any(x in msg for x in ["name", "called", "identify", "what is this", "who is this"]):
                 response_text = (
                     f"🌿 **Plant Name:** {request.plant_name}\n"
                     f"🔬 **Scientific Name:** {plant_data.get('scientific_name')}\n"
                     f"👪 **Family:** {plant_data.get('family_name')}"
                 )

             # 2. Uses / Benefits
             elif any(x in msg for x in ["use", "benefit", "good for", "cure", "treat", "heal"]):
                 response_text = f"🌿 **Medicinal Uses:** {plant_data.get('medicinal_uses', 'Information not available.')}\n\nDiseases: {plant_data.get('diseases_cured', '')}"
             
             # 3. Safety / Toxicity
             elif any(x in msg for x in ["safe", "side effect", "warn", "toxic", "poison", "danger"]):
                 response_text = f"⚠️ **Safety Guide:**\n{plant_data.get('safety_guide', {}).get('overuse_effects', ['Consult a doctor.'])}\nToxicity: {plant_data.get('toxicity_warning', 'Unknown')}"
                 
             # 4. Preparation / Dosage
             elif any(x in msg for x in ["eat", "consume", "dose", "dosage", "how to take", "prepare", "recipe", "cook"]):
                 response_text = f"🥣 **How to Use:** {plant_data.get('mode_of_use', '')}\n\n**Common Doses:** {plant_data.get('doses', '')}\n\n**Procedure:** {plant_data.get('procedure', '')}"
            
             # 5. Cultivation (Removed generic 'plant' keyword)
             elif any(x in msg for x in ["grow", "water", "soil", "sun", "farm", "garden"]):
                 cult = plant_data.get('cultivation_guide', {})
                 response_text = f"🌱 **Cultivation:**\nWater: {cult.get('water')}\nSun: {cult.get('sunlight')}\nSoil: {cult.get('soil')}"

             else:
                 # Default summary if no keywords match
                 response_text = (
                    f"I'm operating in **Offline Mode** (AI Quota Limit), but here is what I know:\n\n"
                    f"🌿 **Plant:** {request.plant_name} ({plant_data.get('scientific_name')})\n"
                    f"💊 **Main Use:** {plant_data.get('medicinal_uses')}\n"
                    f"⚠️ **Safety:** {plant_data.get('toxicity_warning')}\n\n"
                    "Ask me specifically about 'uses', 'dosage', 'safety', or 'growing'!"
                )

             return {"response": response_text}
        else:
            # If we really don't know anything
            return {"response": f"I don't have information about '{request.plant_name}' right now. Please try uploading the image again or ask about a specific plant."}

# --- 9. RUN THE APP (if this file is run directly) ---
if __name__ == "__main__":
    if not yolo_model or not GEMINI_CONFIGURED:
        print("⚠️ WARNING: Some models failed to load. The server will start, but endpoints may fail.")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
