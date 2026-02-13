import sys
from ultralytics import YOLO

# Redirect stdout to a file
with open('model_classes_output.txt', 'w') as f:
    sys.stdout = f
    try:
        print("Loading model...")
        model = YOLO('best.pt')
        print("Model loaded.")
        print("Classes found:")
        print(model.names)
    except Exception as e:
        print(f"Error: {e}")
