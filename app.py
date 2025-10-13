# ===============================================================
# 🌿 Medicinal Plant Recognition System (YOLOv8 + Gemini)
# Author: Kaushlendra Yadav
# Adapted for VS Code with Gradio
# ===============================================================

import os
import json
import cv2
import gradio as gr
import google.generativeai as genai
from ultralytics import YOLO
from dotenv import load_dotenv
from PIL import Image

# --- 1. LOAD ENVIRONMENT VARIABLES and CONFIGURE API KEY ---
# This safely loads your key from the .env file
load_dotenv() 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found. Please create a .env file and add your key.")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    print("✅ Gemini API configured successfully.")

# --- 2. LOAD YOUR MODELS (YOLO and Gemini) ---
# The script will look for 'best.pt' in the same folder.
model_path = 'best.pt' 

try:
    yolo_model = YOLO(model_path)
    print("✅ YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"❌ ERROR: Could not load the YOLO model from {model_path}. Make sure 'best.pt' is in the same folder. Error: {e}")
    yolo_model = None

# Use the stable and powerful Gemini 1.5 Pro model
botanist_persona = "You are a world-class botanist. For any plant name given, you must respond only with a JSON object containing the requested details."
try:
    gemini_model = genai.GenerativeModel(
        'gemini-2.0-flash',
        system_instruction=botanist_persona
    )
    print("✅ Gemini 2.0 flash model initialized.")
except Exception as e:
    print(f"❌ ERROR: Could not initialize Gemini model: {e}")
    gemini_model = None

# --- 3. HELPER FUNCTION TO GET INFO FROM GEMINI ---
def get_plant_info_from_gemini(plant_name):
    """Asks the Gemini API for details and expects a JSON response."""
    print(f"\nAsking Gemini for info on: {plant_name}...")
    prompt = f"""
    Please provide the details for the plant named '{plant_name}' in the required JSON format.
    The JSON should have these keys: "scientific_name", "common_name", "local_name", "family_name", "genus", "native_location", "medicinal_uses".
    For "medicinal_uses", provide a brief summary. If information for any key is not found, use "N/A".
    """
    try:
        response = gemini_model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        clean_json_text = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(clean_json_text)
    except Exception as e:
        return {"error": str(e)}

# --- 4. THE MAIN RECOGNITION FUNCTION FOR GRADIO ---
def recognize_plant(input_image):
    """
    This function takes an image, runs prediction, gets Gemini info, and returns the outputs for the UI.
    """
    if yolo_model is None or gemini_model is None:
        return None, "<p>A required model is not loaded. Please check the terminal for errors.</p>"
    
    # Gradio provides the image as a PIL Image object, which is passed to the model
    results = yolo_model(input_image)
    r = results[0]

    # Get the annotated image
    annotated_image = r.plot() # This returns a BGR numpy array
    annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB) # Convert to RGB for display

    # Get the detected plant names
    detected_names = [yolo_model.names[int(class_id)] for class_id in r.boxes.cls]
    
    info_html = "<h3>🌿 Detected Plant Information</h3>"
    if not detected_names:
        info_html += "<p>No plants were recognized in the image.</p>"
    else:
        unique_detected_names = sorted(list(set(detected_names)))
        for name in unique_detected_names:
            plant_info_dict = get_plant_info_from_gemini(name)
            info_html += f"<h4>{name}</h4>"
            if "error" in plant_info_dict:
                info_html += f"<p>Error: {plant_info_dict['error']}</p>"
            else:
                info_html += f"""
                <p>
                  <b>Scientific Name:</b> {plant_info_dict.get('scientific_name', 'N/A')}<br>
                  <b>Common Name:</b> {plant_info_dict.get('common_name', 'N/A')}<br>
                  <b>Local Name:</b> {plant_info_dict.get('local_name', 'N/A')}<br>
                  <b>Family:</b> {plant_info_dict.get('family_name', 'N/A')}<br>
                  <b>Genus:</b> {plant_info_dict.get('genus', 'N/A')}<br>
                  <b>Location:</b> {plant_info_dict.get('native_location', 'N/A')}<br>
                  <b>Medicinal Uses:</b> {plant_info_dict.get('medicinal_uses', 'N/A')}
                </p>
                """
            info_html += "<hr>"

    # Return the two outputs required by the Gradio interface: the image and the HTML string
    return annotated_image_rgb, info_html

# --- 5. CREATE AND LAUNCH THE GRADIO WEB INTERFACE ---
if __name__ == "__main__":
    demo = gr.Interface(
        fn=recognize_plant,
        inputs=gr.Image(type="pil", label="Upload a Plant Image"),
        outputs=[
            gr.Image(label="Detected Plant"),
            gr.HTML(label="Plant Information")
        ],
        title="🌿 Medicinal Plant Recognition System",
        description="Upload an image to identify a medicinal plant. The system will detect the plant and provide details using AI."
    )
    
    # Launch the web application on your localhost
    demo.launch()