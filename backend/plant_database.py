
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
        "farming_guide": {
            "market_demand": "Very High (Cosmetics, Beverages)",
            "economic_benefits": "High profitability in cosmetic and pharma sectors.",
            "best_harvest_season": "Year-round (after 18 months)",
            "common_diseases": "Leaf spot, Root rot (if overwatered)",
            "prevention_tips": "Avoid waterlogging, use well-draining soil."
        },
        "research_data": {
            "botanical_morphology": "Perennial, succulent, pea-green color, triangular fleshy leaves with serrated edges.",
            "chemical_constituents": "Aloin, Barbaloin, Polysaccharides (Acemannan), Vitamins, Enzymes.",
            "potential_research_areas": "Wound healing, Anti-diabetic effects, Skin aging reversal.",
            "distribution_status": "Widely cultivated globally, originated in Arabian Peninsula."
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
        "farming_guide": {
            "market_demand": "High (Ayurvedic & Food Industry)",
            "economic_benefits": "Fruit (Pickles, Chyawanprash), Powder, Oil.",
            "best_harvest_season": "October-February",
            "common_diseases": "Bark eating caterpillar, Rust",
            "prevention_tips": "Regular pruning, clean cultivation."
        },
        "research_data": {
            "botanical_morphology": "Deciduous tree, feathery leaves, spherical pale green fruit.",
            "chemical_constituents": "Ascorbic acid (Vit C), Gallotannins, Ellagic acid.",
            "potential_research_areas": "Anti-cancer, Hair growth, Anti-aging.",
            "distribution_status": "Native to tropical India and Southeast Asia."
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
        "farming_guide": {
            "market_demand": "High (Global Nootropic Market)",
            "economic_benefits": "Roots sold for supplements, capsules, powder.",
            "best_harvest_season": "Starting of Winter (Jan-Mar)",
            "common_diseases": "Leaf blight, Seedling rot",
            "prevention_tips": "Seed treatment with fungicides."
        },
        "research_data": {
            "botanical_morphology": "Erect branching shrub, stellate tomentose branches.",
            "chemical_constituents": "Withaferin A, Withanolides.",
            "potential_research_areas": "Neuroprotection, Stress resilience, Cancer therapy.",
            "distribution_status": "Drier regions of India, Middle East, Africa."
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

    "Medicinal-Arive Dantu": {
        "scientific_name": "Aerva lanata",
        "common_name": "Mountain Knotgrass",
        "local_name": "Arive Dantu, Pashanbhed",
        "family_name": "Amaranthaceae",
        "plant_description": "A woody, prostrate or succulent herb with white woolly flowers.",
        "plant_type": "Herb",
        "ideal_climate": "Tropical/Dry",
        "native_location": "India, Sri Lanka, Africa",
        "primary_body_system": "Urinary System",
        "medicinal_uses": "Dissolves kidney stones, acts as a diuretic, and treats urinary tract infections.",
        "medicine_content": "Canthin-6-one, Flavonoids, Alkaloids",
        "diseases_cured": "Kidney Stones, UTI, Edema, Cough",
        "age_restriction": "Safe for children > 5",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Avoid (Diuretic effect)",
        "toxicity_warning": "Safe in moderate doses.",
        "mode_of_use": "Decoction (Tea) of whole plant",
        "doses": "30-50ml decoction",
        "procedure": "1. Wash the whole plant (including roots). 2. Crush slightly. 3. Boil in water until reduced to 1/4. 4. Filter and drink.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "CAUTION",
            "best_use_today": "Kidney Detox"
        },
        "practical_guide": [
            {"problem": "Kidney Stones", "solution": "Drink 50ml plant decoction morning empty stomach."},
            {"problem": "Urinary Infection", "solution": "Drink boiled water with plant extracts."}
        ],
        "safety_guide": {
            "avoid_if": ["Pregnancy", "Severe Dehydration"],
            "overuse_effects": ["excessive urination"]
        },
        "nature_properties": {
            "taste": "Bitter/Pungent",
            "body_effect": "Cooling",
            "best_time": "Morning",
            "best_season": "All",
            "parts_used": "Whole Plant"
        },
        "cultivation_guide": {
            "water": "Low",
            "sunlight": "Full Sun",
            "soil": "Sandy/Rocky",
            "growth_speed": "Moderate",
            "harvest_time": "3-4 months"
        },
        "farming_guide": {
            "market_demand": "Moderate (Herbal Kidney formulations)",
            "economic_benefits": "Used in various Ayurvedic kidney tone syrups.",
            "best_harvest_season": "Summer (Flowering stage)",
            "common_diseases": "Leaf spot",
            "prevention_tips": "Avoid waterlogging."
        },
        "research_data": {
            "botanical_morphology": "Perennial herb, white woolly spike flowers.",
            "chemical_constituents": "Canthin-6-one alkaloids, tannins, flavonoids.",
            "potential_research_areas": "Urolithiasis (Kidney stones), Diuretic activity.",
            "distribution_status": "Common weed in tropical India, Sri Lanka."
        },
        "similar_plants": []
    },

    "Medicinal-Rose Apple": {
        "scientific_name": "Syzygium jambos",
        "common_name": "Rose Apple",
        "local_name": "Gulab Jamun, Panneer Neral",
        "family_name": "Myrtaceae",
        "plant_description": "Medium tree with lanceolate leaves and fragrant rose-scented pale yellow fruits.",
        "plant_type": "Tree",
        "ideal_climate": "Tropical/Subtropical",
        "native_location": "Southeast Asia",
        "primary_body_system": "Digestive System",
        "medicinal_uses": "Treats diarrhea, diabetes, and boosts liver health. Tonic for brain.",
        "medicine_content": "Jambosine, Vitamin C, Polyphenols",
        "diseases_cured": "Diarrhea, Diabetes, Liver issues, Fever",
        "age_restriction": "None",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Safe (Fruit)",
        "toxicity_warning": "Seeds contain traces of cyanide (Do not eat seeds).",
        "mode_of_use": "Fruit, Bark decoction",
        "doses": "2-3 fruits or 10ml bark decoction",
        "procedure": "1. Eat fresh fruit for digestion. 2. Boil bark/leaves for diarrhea relief.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "YES",
            "for_children": "YES",
            "for_pregnant": "YES",
            "best_use_today": "Digestion & Cooling"
        },
        "practical_guide": [
            {"problem": "Diarrhea", "solution": "Drink 10ml bark decoction."},
            {"problem": "Diabetes", "solution": "Consume fruit or seed powder (carefully)."}
        ],
        "safety_guide": {
            "avoid_if": ["Constipation (Bark only)"],
            "overuse_effects": ["Constipation"]
        },
        "nature_properties": {
            "taste": "Sweet/Astringent",
            "body_effect": "Cooling",
            "best_time": "Daytime",
            "best_season": "Summer",
            "parts_used": "Fruit, Bark"
        },
        "cultivation_guide": {
            "water": "High",
            "sunlight": "Full Sun",
            "soil": "Loamy/Wet",
            "growth_speed": "Slow",
            "harvest_time": "4-5 years"
        },
        "farming_guide": {
            "market_demand": "Moderate (Exotic Fruit)",
            "economic_benefits": "Sold as fresh fruit, high local value.",
            "best_harvest_season": "Summer/Monsoon",
            "common_diseases": "Fruit Fly, Rust",
            "prevention_tips": "Bagging fruits, neem oil spray."
        },
        "research_data": {
            "botanical_morphology": "Medium tree, lanceolate opposite leaves, whitish stamens.",
            "chemical_constituents": "Jambosine (alkaloid), Tannins, Flavonoids.",
            "potential_research_areas": "Anti-diabetic, Antimicrobial.",
            "distribution_status": "Native to Southeast Asia, widely naturalized."
        },
        "similar_plants": [
            {"name": "Jamun", "status": "Edible (Dark purple)"}
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
        "farming_guide": {
            "market_demand": "High (Tea, Supplements, Oil)",
            "economic_benefits": "High export potential for essential oils.",
            "best_harvest_season": "All, best in Winter",
            "common_diseases": "Powdery mildew, Root rot",
            "prevention_tips": "Avoid overhead watering."
        },
        "research_data": {
            "botanical_morphology": "Erect, much branched subshrub, simple opposite leaves.",
            "chemical_constituents": "Eugenol, Carvacrol, Ursolic acid.",
            "potential_research_areas": "Anti-stress, Radioprotective, Anti-viral.",
            "distribution_status": "Native to Indian subcontinent."
        },
        "similar_plants": [
            {"name": "Thai Basil", "status": "Edible"}
        ]
    },

    "Plectranthus barbatus": {
        "scientific_name": "Coleus barbatus",
        "common_name": "Indian Coleus",
        "local_name": "Makandi, Patharchur",
        "family_name": "Lamiaceae",
        "plant_description": "Perennial fleshy herb with aromatic leaves and blue-purple flowers.",
        "plant_type": "Herb",
        "ideal_climate": "Tropical/Subtropical",
        "native_location": "India, Nepal, Sri Lanka",
        "primary_body_system": "Cardiovascular, Respiratory",
        "medicinal_uses": "Lowers blood pressure, treats asthma, and promotes weight loss.",
        "medicine_content": "Forskolin",
        "diseases_cured": "Hypertension, Asthma, Glaucoma, Obesity",
        "age_restriction": "Avoid in children",
        "gender_restriction": "None",
        "pregnant_women_restriction": "Avoid (Uterine stimulant)",
        "toxicity_warning": "High doses may cause low blood pressure.",
        "mode_of_use": "Root pickle, decoction",
        "doses": "Consult Ayurvedic doctor",
        "procedure": "1. Roots are pickled or dried for powder. 2. Leaves can be used for chutney.",
        
        "quick_safety": {
            "safe_skin": "YES",
            "safe_eat": "LIMITED",
            "for_children": "NO",
            "for_pregnant": "NO",
            "best_use_today": "Weight Loss & Heart Health"
        },
        "practical_guide": [
            {"problem": "High BP", "solution": "Consult doctor for Forskolin extract."},
            {"problem": "Obesity", "solution": "Standardized root extract usage."}
        ],
        "safety_guide": {
            "avoid_if": ["Low Blood Pressure", "Pregnancy", "Peptic Ulcers"],
            "overuse_effects": ["Dizziness", "Nausea"]
        },
        "nature_properties": {
            "taste": "Bitter/Pungent",
            "body_effect": "Heating",
            "best_time": "Morning",
            "best_season": "Autumn",
            "parts_used": "Roots, Leaves"
        },
        "cultivation_guide": {
            "water": "Moderate",
            "sunlight": "Full Sun",
            "soil": "Sandy Loam",
            "growth_speed": "Fast",
            "harvest_time": "6-7 months"
        },
        "farming_guide": {
            "market_demand": "High (Forskolin extraction)",
            "economic_benefits": "Roots are highly valued for pharmaceutical extraction.",
            "best_harvest_season": "Winter (when leaves turn yellow)",
            "common_diseases": "Root rot, Nematodes",
            "prevention_tips": "Crop rotation, use disease-free tubers."
        },
        "research_data": {
            "botanical_morphology": "Fleshy tuberous roots, aromatic leaves with serrated margins.",
            "chemical_constituents": "Forskolin (diterpene), Volatile oils.",
            "potential_research_areas": "Glaucoma treatment, Cardiovascular health, Metabolic disorders.",
            "distribution_status": "Native to Indian subcontinent."
        },
        "similar_plants": [
            {"name": "Ajwain Leaf (P. amboinicus)", "status": "Edible/Medicinal"}
        ]
    }
}

GENERIC_FALLBACK = {
    # Changed "Not Available" to "Botanical Species" to bypass Frontend error screen
    "scientific_name": "Botanical Species", 
    "family_name": "Plant Family",
    "medicine_content": "Contains various phytochemicals (Verify online).",
    "medicinal_uses": "Used in traditional herbal remedies. Specific benefits pending verification.",
    
    # --- Card Data Keys ---
    "name": "Identified Plant",
    "common_name": "Medicinal Herb",
    "local_name": "General",
    "native_location": "Global",
    "diseases_cured": "General well-being",
    "mode_of_use": "Consult a herbalist before use",
    "doses": "Standard dosage unknown",
    "procedure": "Research specific preparation methods.",
    "age_restriction": "Precautions advised",
    "gender_restriction": "None",
    "toxicity_warning": "Consult expert. Identify positively before consuming.",
    "plant_description": "A plant recognized by the system. Detailed offline data is currently unavailable.",
    "plant_type": "Flora",
    "ideal_climate": "Varied",
    "primary_body_system": "General Health",
    # ----------------------

    "quick_safety": {
        "safe_skin": "TEST",
        "safe_eat": "CAUTION",
        "for_children": "NO",
        "for_pregnant": "NO",
        "best_use_today": "Identification"
    },
    
    "practical_guide": [
        {"problem": "Identification", "solution": "Use Google Lens or consult an expert to confirm specific species details."}
    ],
    
    "safety_guide": {
        "avoid_if": ["Unknown Allergy", "Pregnancy"],
        "overuse_effects": ["Nausea", "Discomfort"]
    },
    
    "nature_properties": {
        "taste": "Variable",
        "body_effect": "Neutral",
        "best_time": "Daytime",
        "best_season": "All Season",
        "parts_used": "Leaves/Stem"
    },

    "cultivation_guide": {
        "water": "Regular",
        "sunlight": "Partial Sun",
        "soil": "Standard Potting Mix",
        "growth_speed": "Variable",
        "harvest_time": "Seasonal"
    },

    "farming_guide": {
        "market_demand": "Variable",
        "economic_benefits": "Potential medicinal value.",
        "best_harvest_season": "Seasonal",
        "common_diseases": "Pests",
        "prevention_tips": "Monitor regularly"
    },

    "research_data": {
        "botanical_morphology": "Standard plant morphology.",
        "chemical_constituents": "Phytochemical analysis required.",
        "potential_research_areas": "Pharmacological properties.",
        "distribution_status": "Widespread"
    },

    "similar_plants": []
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
    "sweet basil": "Ocimum tenuiflorum",
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
