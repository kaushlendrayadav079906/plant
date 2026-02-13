
# Static database to use when Gemini API fails (e.g. Quota Exceeded)
# This file is critical for "Offline Mode".

# Static database to use when Gemini API fails (e.g. Quota Exceeded)
# This file is critical for "Offline Mode".

PLANT_DATABASE = {
    # --- A ---
    "Aloe vera": {
        "scientific_name": "Aloe barbadensis miller",
        "common_name": "Aloe Vera",
        "local_name": "Ghritkumari",
        "family_name": "Asphodelaceae",
        "plant_description": "Succulent plant with thick, fleshy, serrated leaves containing gel.",
        "plant_type": "Succulent Herb",
        "ideal_climate": "Dry, Tropical",
        "native_location": "Arabian Peninsula (Global)",
        "primary_body_system": "Skin, Digestion",
        "medicinal_uses": "Soothes burns, improves skin health, and aids digestion.",
        "medicine_content": "Vitamins A, C, E, Bradykinase, Aloin",
        "diseases_cured": "Sunburn, Psoriasis, Constipation, Acne",
        "age_restriction": "Safe for most; consult for infants",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Avoid oral consumption (uterine contractions)",
        "toxicity_warning": "Yellow latex (aloin) can be laxative/toxic.",
        "mode_of_use": "Gel applied topically or juice consumed orally",
        "doses": "10-20ml juice daily",
        "procedure": "1. Cut leaf. 2. Wash away yellow latex. 3. Extract clear gel. 4. Apply or blend.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "CAUTION",
            "best_use_today": "Sunburn & Glow"
        },
        "practical_guide": [
            {"problem": "Sunburn", "solution": "Apply fresh gel directly."},
            {"problem": "Dry Skin", "solution": "Massage gel before bed."}
        ],
        "safety_guide": {
            "avoid_if": ["Pregnant (Oral)", "Diarrhea"],
            "overuse_effects": ["Cramps", "Electrolyte imbalance"]
        },
        "nature_properties": {
            "taste": "Bitter/Tasteless",
            "body_effect": "Cooling",
            "best_time": "Morning/Night",
            "best_season": "All",
            "parts_used": "Leaf Gel"
        },
        "cultivation_guide": {
            "water": "Low",
            "sunlight": "Bright Indirect",
            "soil": "Cactus Mix",
            "growth_speed": "Slow",
            "harvest_time": "Year-round"
        },
        "similar_plants": [
            {"name": "Agave", "status": "Irritant Sap"}
        ]
    },

    "Amla": {
        "scientific_name": "Phyllanthus emblica",
        "common_name": "Indian Gooseberry",
        "local_name": "Amla",
        "family_name": "Phyllanthaceae",
        "plant_description": "Small to medium tree with feathery leaves and round green sour fruits.",
        "plant_type": "Tree",
        "ideal_climate": "Tropical/Subtropical",
        "native_location": "India, Southeast Asia",
        "primary_body_system": "Immunity, Hair",
        "medicinal_uses": "Boosts immunity, improves hair/skin, and aids digestion.",
        "medicine_content": "Vitamin C (High), Tannins, Gallic acid",
        "diseases_cured": "Scurvy, Diabetes, Hair loss, Acid reflux",
        "age_restriction": "None",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Generally Safe",
        "toxicity_warning": "None known",
        "mode_of_use": "Raw fruit, juice, or powder",
        "doses": "1-2 fruits daily",
        "procedure": "1. Wash fruit. 2. Eat raw with salt or extract juice.",
        
         "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "YES",
            "best_use_today": "Immunity Boost"
        },
        "practical_guide": [
            {"problem": "Hair Fall", "solution": "Eat 1 Amla daily; apply oil."},
            {"problem": "Acidity", "solution": "Drink Amla juice with water."}
        ],
        "safety_guide": {
            "avoid_if": ["Hyperacidity (Rare)"],
            "overuse_effects": ["Acid reflux", "Constipation"]
        },
        "nature_properties": {
            "taste": "Sour/Astringent",
            "body_effect": "Cooling",
            "best_time": "Morning",
            "best_season": "Winter",
            "parts_used": "Fruit"
        },
        "cultivation_guide": {
            "water": "Moderate",
            "sunlight": "Full Sun",
            "soil": "Loamy",
            "growth_speed": "Moderate",
            "harvest_time": "Winter"
        },
        "similar_plants": []
    },

    "Ashwagandha": {
        "scientific_name": "Withania somnifera",
        "common_name": "Indian Ginseng",
        "local_name": "Ashwagandha",
        "family_name": "Solanaceae",
        "plant_description": "Small shrub with yellow flowers and red berry-like fruits.",
        "plant_type": "Shrub",
        "ideal_climate": "Dry/Subtropical",
        "native_location": "India, Middle East, Africa",
        "primary_body_system": "Nervous System",
        "medicinal_uses": "Reduces stress, improves energy, and boosts neuro-health.",
        "medicine_content": "Withanolides, Alkaloids",
        "diseases_cured": "Anxiety, Insomnia, Arthritis, Stress",
        "age_restriction": "Not for young children (<12)",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Avoid (Risk of miscarriage)",
        "toxicity_warning": "Large doses cause stomach upset.",
        "mode_of_use": "Root powder mixed with milk/honey",
        "doses": "3-6g powder daily (warm milk)",
        "procedure": "1. Mix 1 tsp powder in warm milk. 2. Add honey. 3. Drink at bedtime.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "NO",
            "for_pregnant": "DANGEROUS",
            "best_use_today": "Stress & Sleep"
        },
        "practical_guide": [
            {"problem": "Insomnia", "solution": "Drink Ashwagandha milk at night."},
            {"problem": "Stress", "solution": "Take 1 capsule or powder daily."}
        ],
        "safety_guide": {
            "avoid_if": ["Hypertension (Consult)", "Pregnancy", "Autoimmune Dieases"],
            "overuse_effects": ["Drowsiness", "Upset Stomach"]
        },
        "nature_properties": {
            "taste": "Bitter/Horse-smell",
            "body_effect": "Heating",
            "best_time": "Night",
            "best_season": "Winter",
            "parts_used": "Roots, Leaves"
        },
        "cultivation_guide": {
            "water": "Low",
            "sunlight": "Full Sun",
            "soil": "Dry/Sandy",
            "growth_speed": "Slow",
            "harvest_time": "6 months"
        },
        "similar_plants": [
             {"name": "Physalis (Cape Gooseberry)", "status": "Edible Fruit"}
        ]
    },

    "Medicinal-Neem": {
        "scientific_name": "Azadirachta indica",
        "common_name": "Neem",
        "local_name": "Neem, Margosa",
        "family_name": "Meliaceae",
        "plant_description": "A fast-growing tree with serrated leaves and white fragrant flowers.",
        "plant_type": "Tree",
        "ideal_climate": "Tropical & Subtropical",
        "native_location": "India, Myanmar, Sri Lanka",
        "primary_body_system": "Skin, Blood, Immunity",
        "medicinal_uses": "Powerful antiseptic, blood purifier, treats skin issues, and boosts immunity.",
        "medicine_content": "Azadirachtin, Nimbin, Quercetin, Gedunin",
        "diseases_cured": "Acne, Chickenpox, Eczema, Diabetes, Gum Disease, Fever",
        "age_restriction": "Avoid in infants (<2 yrs)",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Avoid (Risk of miscarriage)",
        "toxicity_warning": "Neem oil is toxic if consumed internally in large amounts.",
        "mode_of_use": "Paste, oil, tea, or chew raw leaves",
        "doses": "2-4 leaves daily or 5ml juice",
        "procedure": "1. Grind fresh leaves to paste for skin. 2. Boil leaves in water for bath. 3. Chew 2-3 tender leaves empty stomach for detox.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "CAUTION",
            "for_pregnant": "DANGEROUS",
            "best_use_today": "Skin Acne & Detox"
        },
        
        "practical_guide": [
            {"problem": "Pimples/Acne", "solution": "Apply fresh neem leaf paste for 15 mins."},
            {"problem": "Dandruff", "solution": "Wash hair with boiled neem water."},
            {"problem": "Chickenpox", "solution": "Sleep on neem leaves; use neem water bath."}
        ],
        
        "safety_guide": {
            "avoid_if": ["Pregnant women", "Couples trying to conceive", "Infants"],
            "overuse_effects": ["Low blood sugar", "Kidney strain", "Infertility (temporary)"]
        },
        
        "nature_properties": {
            "taste": "Bitter",
            "body_effect": "Cooling & Drying",
            "best_time": "Morning (Empty Stomach)",
            "best_season": "Spring/Summer",
            "parts_used": "Leaves, Bark, Oil, Flowers"
        },

        "cultivation_guide": {
            "water": "Low (Drought Tolerant)",
            "sunlight": "Full Sun",
            "soil": "Well-drained, Sandy",
            "growth_speed": "Fast",
            "harvest_time": "3-5 years for timber, leaves anytime"
        },
        
        "farming_guide": {
            "market_demand": "High (Pesticides/Pharma)",
            "economic_benefits": "Neem oil and cake have high export value. Reduces fertilizer costs.",
            "best_harvest_season": "Summer (Fruits), All year (Leaves)",
            "common_diseases": "Tip blight, Leaf spot",
            "prevention_tips": "Prune infected parts, ensure soil drainage."
        },

        "research_data": {
            "botanical_morphology": "Compound impartipinnate leaves, white bisexual flowers, glabrous fruit.",
            "chemical_constituents": "Azadirachtin (pesticide), Nimbin (anti-inflammatory), Gedunin.",
            "potential_research_areas": "Biopesticides, Antifertility agents, Antiviral drugs.",
            "distribution_status": "Native to Indian subcontinent; invasive in some African regions."
        },

        "similar_plants": [
            {"name": "Curry Leaves", "status": "Edible (Different smell)"},
            {"name": "Chinaberry (Bakain)", "status": "Toxic (Lookalike)"}
        ]
    },

    "Medicinal-Basale": {
        "scientific_name": "Basella alba", 
        "common_name": "Malabar Spinach",
        "local_name": "Basale, Poi",
        "family_name": "Basellaceae", 
        "plant_description": "Fast-growing vine with heart-shaped fleshy leaves and red/purple stems.",
        "plant_type": "Climbing Vine",
        "ideal_climate": "Tropical/Humid",
        "native_location": "Asia, Africa",
        "primary_body_system": "Digestive, Blood",
        "medicinal_uses": "Cooling, high fiber, treats mouth ulcers.",
        "medicine_content": "Vitamin A, C, Iron, Calcium, Mucilage",
        "diseases_cured": "Constipation, Mouth ulcers, Anemia",
        "age_restriction": "None",
        "gender_restriction": "None", 
        "pregnant_women_restriction": "Safe and beneficial (High Folate)",
        "toxicity_warning": "None",
        "mode_of_use": "Cooked as vegetable or soup",
        "doses": "Standard dietary portion",
        "procedure": "1. Wash leaves. 2. Chop. 3. Cook with lentils or stir-fry (Do not eat raw in large qty due to oxalates).",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "YES",
            "best_use_today": "Mouth Ulcers"
        },
        "practical_guide": [
            {"problem": "Mouth Ulcers", "solution": "Chew clean raw leaf or eat cooked."},
            {"problem": "Constipation", "solution": "Eat cooked leaves with meals."}
        ],
        "safety_guide": {
            "avoid_if": ["Kidney Stones (Oxalates)"],
            "overuse_effects": ["None (Dietary)"]
        },
        "nature_properties": {
            "taste": "Mucilaginous/Spinach-like",
            "body_effect": "Cooling",
            "best_time": "Lunch",
            "best_season": "Rainy/Summer",
            "parts_used": "Leaves, Stems"
        },
        "cultivation_guide": {
            "water": "High",
            "sunlight": "Partial Sun",
            "soil": "Moist, Fertile",
            "growth_speed": "Fast",
            "harvest_time": "4-6 weeks"
        },
        "similar_plants": [
            {"name": "Spinach", "status": "Edible"}
        ]
    },

    "Ocimum tenuiflorum": {
         "scientific_name": "Ocimum tenuiflorum", 
         "common_name": "Holy Basil",
         "local_name": "Tulsi",
         "family_name": "Lamiaceae", 
         "plant_description": "Aromatic subshrub with hairy stems and purple/green leaves.",
         "plant_type": "Herb/Subshrub",
         "ideal_climate": "Tropical",
         "native_location": "India",
         "primary_body_system": "Respiratory, Immunity",
         "medicinal_uses": "Adaptogen, fights respiratory infections, reduces stress.",
         "medicine_content": "Eugenol, Ursolic acid, Rosmarinic acid",
         "diseases_cured": "Cold, Cough, Flu, Stress, Asthma",
         "age_restriction": "Safe for children > 2",
         "gender_restriction": "None", 
         "pregnant_women_restriction": "Avoid in excess",
         "toxicity_warning": "Eugenol (blood thinning) in high doses.",
         "mode_of_use": "Tea, raw leaves, drops",
         "doses": "5-10 leaves or 1 cup tea",
         "procedure": "1. Boil water with 5-7 leaves. 2. Add ginger/honey. 3. Strain and drink.",
         
         "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "LIMITED",
            "best_use_today": "Cough & Cold"
        },
        "practical_guide": [
            {"problem": "Cold/Cough", "solution": "Drink Tulsi Ginger Tea."},
            {"problem": "Stress", "solution": "Chew 5 leaves morning."}
        ],
        "safety_guide": {
            "avoid_if": ["Surgery (Blood thinner)", "Trying to conceive"],
            "overuse_effects": ["Thinning blood"]
        },
        "nature_properties": {
            "taste": "Pungent/Astringent",
            "body_effect": "Heating",
            "best_time": "Morning/Evening",
            "best_season": "All",
            "parts_used": "Leaves"
        },
        "cultivation_guide": {
            "water": "Moderate",
            "sunlight": "Full/Partial Sun",
            "soil": "Well-drained",
            "growth_speed": "Moderate",
            "harvest_time": "3 months"
        },
        "similar_plants": [
            {"name": "Thai Basil", "status": "Edible"}
        ]
    }
}

GENERIC_FALLBACK = {
    "scientific_name": "Unknown Species",
    "family_name": "Unknown Family",
    "medicine_content": "Information unavailable offline",
    "medicinal_uses": "Specific medicinal uses not found in offline database.",
    
    # --- Card Data Keys ---
    "common_name": "Unknown",
    "local_name": "Unknown",
    "native_location": "Native region information unavailable",
    "diseases_cured": "Various general ailments",
    "mode_of_use": "Consult a local herbalist",
    "doses": "Do not consume without advice",
    "procedure": "No standard procedure available offline.",
    "age_restriction": "Consult a doctor",
    "gender_restriction": "None",
    "toxicity_warning": "Consult expert before use.",
    "plant_description": "Green medicinal plant.",
    "plant_type": "Herb/Shrub",
    "ideal_climate": "Tropical",
    "primary_body_system": "General Health",
    # ----------------------

    "quick_safety": {
        "safe_skin": "Caution",
        "safe_eat": "No",
        "for_children": "No",
        "for_pregnant": "Consult Doctor",
        "best_use_today": "Consult Expert"
    },
    
    "practical_guide": [
        {"problem": "General Health", "solution": "Consult a local herbalist"},
        {"problem": "Skin Issues", "solution": "Patch test before application"}
    ],
    
    "safety_guide": {
        "avoid_if": ["Pregnant women", "Infants", "Severe illness"],
        "overuse_effects": ["Nausea", "Allergic reaction"]
    },
    
    "nature_properties": {
        "taste": "Unknown",
        "body_effect": "Unknown",
        "best_time": "Daytime",
        "best_season": "All",
        "parts_used": "Leaves (General)"
    },

    "cultivation_guide": {
        "water": "Moderate",
        "sunlight": "Partial Shade",
        "soil": "Well-drained",
        "growth_speed": "Average",
        "harvest_time": "Year-round"
    },

    "farming_guide": {
        "market_demand": "Moderate local demand",
        "economic_benefits": "Local sale, home use",
        "best_harvest_season": "Year-round",
        "common_diseases": "Fungal spots, Root rot",
        "prevention_tips": "Avoid waterlogging, ensure air circulation"
    },

    "research_data": {
        "botanical_morphology": "Standard green leafy plant structure.",
        "chemical_constituents": "Basic phytochemicals (flavonoids, tannins)",
        "potential_research_areas": "General medicinal properties",
        "distribution_status": "Widely distributed"
    },

    "similar_plants": [
        {"name": "No lookalikes found", "status": "Unknown"}
    ]
}


ALIASES = {
    # Model Label -> Database Key
    "aloevera": "Aloe vera",
    "neem": "Medicinal-Neem",
    "medicinal-neem": "Medicinal-Neem",
    "medicinal-basale": "Medicinal-Basale",
    "basale": "Medicinal-Basale",
    "tulsi": "Ocimum tenuiflorum",
    "vana_tulsi": "Ocimum tenuiflorum",
    "holy basil": "Ocimum tenuiflorum",
    "ocimum tenuiflorum": "Ocimum tenuiflorum",
    "amla": "Amla",
    "indian gooseberry": "Amla",
    "ashwagandha": "Ashwagandha",
    "withania somnifera": "Ashwagandha"
}

def get_fallback_data(plant_name):
    """
    Retrieves plant data from the local dictionary with robust matching.
    """
    plant_lower = plant_name.lower().strip()
    
    # 0. Check Explicit Aliases
    if plant_lower in ALIASES:
        target_key = ALIASES[plant_lower]
        if target_key in PLANT_DATABASE:
            data = PLANT_DATABASE[target_key].copy()
            data['name'] = plant_name # Use original query name
            if 'common_name' not in data: data['common_name'] = target_key
            return data

    found_data = None

    # 1. Exact Key Match (Case-Insensitive)
    for key, val in PLANT_DATABASE.items():
        if key.lower() == plant_lower:
            found_data = val.copy()
            break
            
    # 2. Normalized Match (remove spaces, hyphens, special chars)
    if not found_data:
        import re
        def normalize(s): return re.sub(r'[^a-zA-Z0-9]', '', s).lower()
        
        norm_plant = normalize(plant_name)
        for key, val in PLANT_DATABASE.items():
            if normalize(key) == norm_plant:
                found_data = val.copy()
                break

    # 3. Partial Match (SEARCHED name inside KEY or vice versa)
    if not found_data:
        for key, val in PLANT_DATABASE.items():
            # Example: "Medicinal-Neem" matches "Neem"
            if plant_lower in key.lower() or key.lower() in plant_lower:
                # Filter out very short matches to avoid noise
                if len(key) > 3 and len(plant_name) > 3:
                    found_data = val.copy()
                    break

    # 4. Regex/Prefix Stripping (Legacy support)
    if not found_data:
        import re
        clean_name = re.sub(r'^(Medicinal-|Medicinal\s+)', '', plant_name, flags=re.IGNORECASE)
        if clean_name != plant_name:
             # Try alias or recursive lookup with clean name
             return get_fallback_data(clean_name)

    # 5. Generic Fallback
    final_data = GENERIC_FALLBACK.copy()
    if found_data:
        final_data.update(found_data)
        final_data['name'] = plant_name 
    else:
        final_data['name'] = plant_name
        final_data['common_name'] = plant_name

    return final_data
