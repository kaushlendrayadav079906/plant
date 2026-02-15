# ===============================================================
# 🌿 Medicinal Plant Recognition System (VERCEL BACKEND)
# Author: Kaushlendra Yadav
# Optimized for Vercel Serverless Functions limits (< 250MB) 
# ===============================================================

import os
import io
import json
import base64
import logging
import numpy as np
import onnxruntime as ort
import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from plant_database import get_fallback_data

# --- 0. Logging Configuration (Stream for Vercel) ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s:%(message)s',
    handlers=[logging.StreamHandler()]
)

# --- 1. Load Environment Variables ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_CONFIGURED = False

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_CONFIGURED = True
    print("✅ Gemini API Configured")
else:
    print("❌ Gemini Key Not Found in Environment Variables")

# --- 2. Lightweight YOLO ONNX Runtime Wrapper ---
class YOLO_ONNX:
    def __init__(self, model_path, class_names):
        try:
            self.session = ort.InferenceSession(model_path)
            self.input_name = self.session.get_inputs()[0].name
            self.output_name = self.session.get_outputs()[0].name
            self.class_names = class_names
            self.conf_threshold = 0.25
            self.iou_threshold = 0.45
            print(f"✅ ONNX Model Loaded: {model_path}")
        except Exception as e:
            print(f"❌ Failed to load ONNX model: {e}")
            self.session = None

    def preprocess(self, image):
        # Resize to 640x640 (standard YOLO input)
        self.img_width, self.img_height = image.size
        img = image.resize((640, 640))
        img_data = np.array(img).astype(np.float32)
        img_data = img_data / 255.0  # Normalize to 0-1
        img_data = img_data.transpose(2, 0, 1)  # HWC to CHW
        img_data = np.expand_dims(img_data, axis=0)  # Add batch dimension
        return img_data

    def postprocess(self, output):
        # Output shape: [1, 4 + num_classes, 8400]
        output = output[0].transpose()  # [8400, 4 + num_classes]
        
        boxes = []
        confidences = []
        class_ids = []

        # Parse detections
        for row in output:
            classes_scores = row[4:]
            _, max_score, _, max_class_id = cv2_minMaxLoc(classes_scores) if 'cv2' in globals() else self._manual_max(classes_scores)
            
            if max_score > self.conf_threshold:
                # YOLO format: cx, cy, w, h
                cx, cy, w, h = row[0], row[1], row[2], row[3]
                
                # Convert to x1, y1, x2, y2
                left = int((cx - w/2) * (self.img_width / 640))
                top = int((cy - h/2) * (self.img_height / 640))
                width = int(w * (self.img_width / 640))
                height = int(h * (self.img_height / 640))
                
                boxes.append([left, top, width, height])
                confidences.append(float(max_score))
                class_ids.append(int(max_class_id))

        # Apply NMS (Non-Maximum Suppression)
        indices = self._nms(boxes, confidences, self.iou_threshold)
        
        results = []
        for i in indices:
            results.append({
                "box": boxes[i],
                "conf": confidences[i],
                "class_id": class_ids[i],
                "name": self.class_names[class_ids[i]] if class_ids[i] < len(self.class_names) else "Undefined"
            })
        return results

    def _manual_max(self, arr):
        # Helper to find max value and index without cv2
        max_val = -1.0
        max_idx = -1
        for i, val in enumerate(arr):
            if val > max_val:
                max_val = val
                max_idx = i
        return (None, max_val, None, max_idx)

    def _nms(self, boxes, confidences, iou_threshold):
        # Simple NMS implementation
        if not boxes: return []
        
        # Sort by confidence
        sorted_indices = np.argsort(confidences)[::-1]
        keep = []
        
        while len(sorted_indices) > 0:
            current = sorted_indices[0]
            keep.append(current)
            if len(sorted_indices) == 1: break
            
            # Remove current box
            remaining_indices = sorted_indices[1:]
            
            # Calculate IoU
            ious = []
            for idx in remaining_indices:
                ious.append(self._calculate_iou(boxes[current], boxes[idx]))
            
            # Keep boxes with low IoU
            mask = np.array(ious) < iou_threshold
            sorted_indices = remaining_indices[mask]
            
        return keep

    def _calculate_iou(self, box1, box2):
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[0] + box1[2], box2[0] + box2[2])
        y2 = min(box1[1] + box1[3], box2[1] + box2[3])
        
        intersection = max(0, x2 - x1) * max(0, y2 - y1)
        area1 = box1[2] * box1[3]
        area2 = box2[2] * box2[3]
        
        return intersection / (area1 + area2 - intersection + 1e-6)

    def detect(self, image):
        if not self.session: return []
        input_tensor = self.preprocess(image)
        outputs = self.session.run([self.output_name], {self.input_name: input_tensor})
        return self.postprocess(outputs)

# --- 3. Initialize App & Models ---
app = FastAPI(title="Plant API (Vercel Optimized)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORTANT: Update this list based on your training data!
# These are mapped from your plant_database.py aliases.
CLASS_NAMES = [
    "Aloevera", "Amla", "Amruta_Balli", "Arali", "Ashoka", "Ashwagandha", 
    "Avacado", "Bamboo", "Basale", "Betel", "Betel_Nut", "Brahmi", "Castor", 
    "Curry_Leaf", "Doddapatre", "Ekka", "Ganike", "Guava", "Geranium", 
    "Henna", "Hibiscus", "Honge", "Insulin", "Jasmine", "Lemon", "Lemon_Grass", 
    "Mango", "Mint", "Nagadali", "Neem", "Nithyapushpa", "Nooni", "Pappaya", 
    "Pepper", "Pomegranate", "Rakta_Chandana", "Rose", "Rose_Apple", 
    "Sapota", "Tulsi", "Wood_Apple" 
]

onnx_model_path = "best.onnx"
# Only init model if file exists to prevent startup crash on generic builds
detector = YOLO_ONNX(onnx_model_path, CLASS_NAMES) if os.path.exists(onnx_model_path) else None

# Helper: Draw Boxes with PIL (Lightweight)
def draw_boxes(image, detections):
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", size=20)
    except:
        font = ImageFont.load_default()
        
    for det in detections:
        box = det['box'] # x, y, w, h
        label = f"{det['name']} {det['conf']:.2f}"
        
        # Draw Box
        draw.rectangle([box[0], box[1], box[0]+box[2], box[1]+box[3]], outline="red", width=3)
        
        # Draw Label
        text_bbox = draw.textbbox((box[0], box[1]), label, font=font)
        draw.rectangle([text_bbox[0], text_bbox[1], text_bbox[2], text_bbox[1] + 20], fill="red")
        draw.text((box[0], box[1]), label, fill="white", font=font)
    
    return image

# --- 4. API Endpoints ---

@app.get("/")
def home():
    if not detector or not detector.session:
        return {"status": "Model Missing", "message": "Please upload 'best.onnx' to backend folder."}
    return {"status": "Online", "model": "ONNX Runtime"}

class ChatRequest(BaseModel):
    plant_name: str
    message: str

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not detector or not detector.session:
        raise HTTPException(status_code=500, detail="Model 'best.onnx' not found on server.")

    try:
        # Read Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Detect
        # Limit image size for memory safety
        if image.width > 1024 or image.height > 1024:
            image.thumbnail((1024, 1024))
            
        detections = detector.detect(image)
        
        # Draw Annotations
        annotated_img = image.copy()
        annotated_img = draw_boxes(annotated_img, detections)
        
        # Encode Response
        buffered = io.BytesIO()
        annotated_img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Prepare Data
        plant_data = []
        if not detections:
            plant_data.append({"name": "No Plant Detected", "error": "No recognizable plant found."})
        else:
            seen_plants = set()
            for d in detections:
                name = d['name']
                if name in seen_plants: continue
                seen_plants.add(name)
                
                # Get Info (Gemini/Fallback)
                info = get_fallback_data(name)
                if GEMINI_CONFIGURED and info.get("scientific_name") == "Botanical Species":
                    # Only fetch from Gemini if local DB is generic
                     pass # (Optional: Add verified Gemini fetching here if needed later)
                
                info['confidence'] = f"{d['conf']*100:.1f}%"
                plant_data.append(info)
                
        return {"annotated_image": img_str, "plant_data": plant_data}

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not GEMINI_CONFIGURED:
        return {"response": "Chat unavailable (API Key missing)."}
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    chat = model.start_chat()
    response = chat.send_message(f"User found plant: {request.plant_name}. Question: {request.message}")
    return {"response": response.text}
