
import os
import sys
from dotenv import load_dotenv

print("--- Checking Setup ---")
print(f"Current Working Directory: {os.getcwd()}")

# 1. Check Imports
try:
    import fastapi
    import uvicorn
    import ultralytics
    import google.generativeai as genai
    import cv2
    import PIL
    import numpy
    print("✅  All imports successful.")
except ImportError as e:
    print(f"❌  Import Error: {e}")
    sys.exit(1)

# 2. Check .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"✅  GEMINI_API_KEY found: {api_key[:5]}...")
else:
    print("❌  GEMINI_API_KEY not found in .env")

# 3. Check YOLO Model File
model_path = 'best.pt'
if os.path.exists(model_path):
    print(f"✅  '{model_path}' file exists.")
else:
    print(f"❌  '{model_path}' NOT found in current directory.")

# 4. Try Loading YOLO
print("Attempting to load YOLO model (this might take a moment)...")
try:
    from ultralytics import YOLO
    model = YOLO(model_path)
    print("✅  YOLO model loaded successfully.")
except Exception as e:
    print(f"❌  Failed to load YOLO model: {e}")

print("--- Check Complete ---")
