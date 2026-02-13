import sys
from plant_database import get_fallback_data

test_cases = [
    "Neem", "Medicinal-Neem", "neem", "medicinal-neem", # Should match Medicinal-Neem
    "Tulsi", "vana_tulsi", "Ocimum tenuiflorum", "holy basil", # Should match Ocimum tenuiflorum
    "Aloe vera", "AloeVera", "aloevera", # Should match Aloe vera
    "Amla", "Indian Gooseberry", # Should match Amla
    "Basale", "Medicinal-Basale", "medicinal-basale", # Should match Medicinal-Basale
    "Ashwagandha", "withania somnifera", # Should match Ashwagandha
    "UnknownPlantXYZ" # Should fallback
]

print(f"{'INPUT':<20} | {'MATCHED KEY':<25} | {'Source'} | {'Medicinal Uses'}")
print("-" * 75)

for name in test_cases:
    data = get_fallback_data(name)
    # identify which key it matched by looking at scientific name or family
    scientific = data.get('scientific_name', 'Unknown')
    # Or try to find the key in PLANT_DATABASE that matches this data
    
    print(f"{name:<20} | {scientific:<25} | {data.get('common_name', 'N/A'):<6} | {data['medicinal_uses']}")
