
from ultralytics import YOLO

try:
    model = YOLO('best.pt')
    print("--- MODEL CLASS NAMES ---")
    print(model.names)
    print("-------------------------")
except Exception as e:
    print(f"Error loading model: {e}")
