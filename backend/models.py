# models.py
from pymongo import MongoClient
from config import get_settings
from pymongo.server_api import ServerApi


client = MongoClient(get_settings().MONGO_URI, server_api=ServerApi('1'))


try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
db = client["branch_tracking"]
user_collection = db["users"]
todo_collection = db["todos"]
branch_tracking_collection = db["branch_tracking"]

