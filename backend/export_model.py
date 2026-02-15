from ultralytics import YOLO
import sys

# Load the model
try:
    print("Loading YOLO model...")
    model = YOLO("best.pt")
    
    # Print classes for you to copy into main.py
    print("\n✅ COPY THESE CLASSES INTO main.py (CLASS_NAMES list):")
    print(model.names)
    print("------------------------------------------------------\n")
    
    # Export to ONNX
    print("Exporting model to ONNX format...")
    model.export(format="onnx")
    print("\n🎉 Success! 'best.onnx' has been created.")
    print("Now push 'best.onnx' to GitHub and deploy.")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("Make sure 'ultralytics' is installed: pip install ultralytics")
