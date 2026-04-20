import os
import sys
import subprocess
import datetime
import json

from dotenv import load_dotenv
load_dotenv() # Load the .env file BEFORE reading MONGODB_URI

# Auto-install pymongo[srv] if not present (needed for MongoDB Atlas)
try:
    from pymongo import MongoClient
    import dns # Required for mongodb+srv://
except ImportError:
    print("⏳ 'pymongo[srv]' not found. Installing it automatically for Atlas support...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo[srv]"])
    print("✅ 'pymongo' installed successfully. Loading...")
    from pymongo import MongoClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "plant_db")

MONGO_CONNECTED = False
db = None
history_collection = None
plants_collection = None
users_collection = None

try:
    # 30 seconds timeout to safely allow MongoDB Atlas to connect
    mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=30000)
    db = mongo_client[MONGODB_DB_NAME]
    history_collection = db["history"]
    plants_collection = db["plants"] # For caching plant information
    users_collection = db["users"] # For storing user accounts
    
    # Test connection
    mongo_client.server_info()
    MONGO_CONNECTED = True
    print(f"✅ Connected to MongoDB database: {MONGODB_DB_NAME}")
except Exception as e:
    print(f"⚠️ Warning: Could not connect to MongoDB. Using local files instead. Error: {e}")
    MONGO_CONNECTED = False


# --- History CRUD Operations ---

def create_history_record(entry_data):
    """Create a new scan history record"""
    if not MONGO_CONNECTED:
        return False
    try:
        history_collection.insert_one(entry_data.copy())
        return True
    except Exception as e:
        print(f"⚠️ Failed to save to MongoDB: {e}")
        return False

def get_all_history(limit=50):
    """Read history records"""
    if not MONGO_CONNECTED:
        return None
    try:
        records = list(history_collection.find().sort("timestamp", -1).limit(limit))
        for record in records:
            record["_id"] = str(record["_id"])
        return records
    except Exception as e:
        print(f"Error fetching from MongoDB: {e}")
        return None

def delete_all_history():
    """Delete all history records"""
    if not MONGO_CONNECTED:
        return False
    try:
        history_collection.delete_many({})
        return True
    except Exception as e:
        print(f"⚠️ Failed to clear MongoDB history: {e}")
        return False

def delete_history_item_by_match(plant_name, date_str):
    """Delete a specific history record"""
    if not MONGO_CONNECTED:
        return False
    try:
        history_collection.delete_one({"plant_name": plant_name, "date": date_str})
        return True
    except Exception as e:
        print(f"⚠️ Failed to delete from MongoDB: {e}")
        return False


# --- Plant Details CRUD Operations ---

def get_plant_from_db(plant_name):
    """Fetch plant details from MongoDB"""
    if not MONGO_CONNECTED:
        return None
    try:
        plant_data = plants_collection.find_one({"name": plant_name})
        if plant_data:
            plant_data["_id"] = str(plant_data["_id"])
            return plant_data
        return None
    except Exception as e:
        print(f"Error fetching plant from MongoDB: {e}")
        return None

def save_plant_to_db(plant_name, plant_data):
    """Save plant details to MongoDB"""
    if not MONGO_CONNECTED:
        return False
    try:
        # Upsert: update if exists, otherwise insert
        plants_collection.update_one(
            {"name": plant_name},
            {"$set": plant_data},
            upsert=True
        )
        return True
    except Exception as e:
        print(f"⚠️ Failed to save plant to MongoDB: {e}")
        return False


# --- User CRUD Operations ---

USERS_FILE = "users.json"

def load_local_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_local_users(users_list):
    with open(USERS_FILE, "w") as f:
        json.dump(users_list, f, indent=4)

def create_user(name, email, password):
    """Create a new user"""
    new_user = {
        "name": name,
        "email": email,
        "password": password,
        "created_at": str(datetime.datetime.now())
    }
    
    if not MONGO_CONNECTED:
        # Fallback to local JSON
        users = load_local_users()
        if any(u.get("email") == email for u in users):
            return None # User exists
        users.append(new_user)
        save_local_users(users)
        return {"name": name, "email": email}
    
    if users_collection.find_one({"email": email}):
        return None # User already exists
        
    users_collection.insert_one(new_user)
    return {"name": name, "email": email}

def authenticate_user(email, password):
    """Read/authenticate a user"""
    if not MONGO_CONNECTED:
        # Fallback to local JSON
        users = load_local_users()
        for u in users:
            if u.get("email") == email and u.get("password") == password:
                return {"name": u["name"], "email": u["email"]}
        return None
        
    db_user = users_collection.find_one({"email": email, "password": password})
    if db_user:
        return {"name": db_user["name"], "email": db_user["email"]}
    return None

