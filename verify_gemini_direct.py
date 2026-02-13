import sys
import json
import os
import time

# Force unbuffered output for debugging
sys.stdout.reconfigure(line_buffering=True)

try:
    # Add current directory to path
    sys.path.append(os.getcwd())
    
    print("Importing main.py (this will load models)...")
    from main import get_plant_info_from_gemini, GEMINI_CONFIGURED, yolo_model

    print("\n--- Testing Gemini Integration ---")
    if not GEMINI_CONFIGURED:
        print("❌ Error: Gemini API Key not configured in main.py")
    else:
        print("✅ Gemini API Key is configured.")

    plant_name = "Ocimum tenuiflorum" # Tulsi
    print(f"\nQuerying Gemini for plant: '{plant_name}'...")
    
    start_time = time.time()
    info = get_plant_info_from_gemini(plant_name)
    end_time = time.time()
    
    print(f"Response received in {end_time - start_time:.2f} seconds.")
    print("\n--- Result from Gemini ---")
    print(json.dumps(info, indent=2))
    
    output_file = "gemini_test_result.json"
    with open(output_file, "w") as f:
        json.dump(info, f, indent=2)
    print(f"\nResult saved to {output_file}")

    print("\n--- Testing YOLO Model Loading ---")
    if yolo_model:
        print("✅ YOLO model is loaded and ready.")
    else:
        print("❌ YOLO model failed to load.")

except Exception as e:
    print(f"\n❌ Test Failed with Exception: {e}")
    import traceback
    traceback.print_exc()
