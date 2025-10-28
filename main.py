# ===============================================================
# 🌿 Medicinal Plant Recognition System (BACKEND API)
# Author: Kaushlendra Yadav
# API built with FastAPI (This REPLACES Gradio)
# ===============================================================

import os
import json
import cv2
import io
import base64
import numpy as np
import uvicorn
import google.generativeai as genai
from ultralytics import YOLO
from dotenv import load_dotenv
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
def get_plant_info_from_gemini(plant_name: str):
    """Asks the Gemini API for details and expects a JSON response."""
    if not gemini_data_model:
        return {"error": "Gemini data model not initialized."}
        
    print(f"\nAsking Gemini for info on: {plant_name}...")
    prompt = f"""
    Please provide the details for the plant named '{plant_name}' in the required JSON format.
    The JSON should have these keys: "scientific_name", "common_name", "local_name", "family_name", "genus", "native_location", "medicinal_uses".
    For "medicinal_uses", provide a brief summary. If information for any key is not found, use "N/A".
    """
    try:
        response = gemini_data_model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        clean_json_text = response.text.strip().replace('```json', '').replace('```', '')
        data = json.loads(clean_json_text)
        data['name'] = plant_name # Add the original name for convenience
        return data
    except Exception as e:
        print(f"❌ ERROR parsing Gemini JSON: {e}\nRaw response: {response.text}")
        return {"error": f"Could not parse details from AI. Error: {str(e)}", "name": plant_name}

# --- 4. CREATE THE FASTAPI APP ---
app = FastAPI(
    title="🌿 Medicinal Plant API",
    description="API for detecting medicinal plants and getting information."
)

# --- 5. CONFIGURE CORS (This is the connection!) ---
# This allows your React frontend (on http://localhost:5173) 
# to talk to this backend (on http://localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # The address of your React app
        "http://localhost:5174",  # A common alternative port for Vite
        "http://localhost:3000"   # A common port for create-react-app
    ],
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- 6. API "ROOT" ENDPOINT ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Medicinal Plant Recognition API. Use the /predict endpoint to get started."}

# --- 7. API "PREDICT" ENDPOINT ---
# This is what your React app will call
@app.post("/predict")
async def predict_plant(file: UploadFile = File(...)):
    """
    This endpoint receives an image, runs YOLO detection, gets Gemini info,
    and returns a JSON response.
    """
    if not yolo_model or not GEMINI_CONFIGURED:
        raise HTTPException(status_code=500, detail="A required model is not loaded. Check server logs.")

    # --- Read and process the image ---
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents))
        
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    # --- Run YOLO detection ---
    results = yolo_model(pil_image)
    r = results[0]

    # --- Get annotated image ---
    annotated_image = r.plot() 
    annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
    
    # --- Encode image to Base64 ---
    pil_img_annotated = Image.fromarray(annotated_image_rgb)
    buffered = io.BytesIO()
    pil_img_annotated.save(buffered, format="JPEG")
    base64_image_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # --- Get detected plant names and Gemini info ---
    detected_names = [yolo_model.names[int(class_id)] for class_id in r.boxes.cls]
    unique_detected_names = sorted(list(set(detected_names)))
    
    plant_data_list = []
    if not unique_detected_names:
        plant_data_list.append({"name": "No plant detected", "error": "No plant was recognized in the image."})
    else:
        for name in unique_detected_names:
            plant_info = get_plant_info_from_gemini(name)
            plant_data_list.append(plant_info)

    # --- Return the final JSON response ---
    return {
        "annotated_image": base64_image_str,
        "plant_data": plant_data_list
    }

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
        print(f"❌ ERROR in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {e}")

# --- 9. RUN THE APP (if this file is run directly) ---
if __name__ == "__main__":
    print("Starting FastAPI server... Access it at http://localhost:8000")
    uvicorn.run(app, host="localhost", port=8000)

