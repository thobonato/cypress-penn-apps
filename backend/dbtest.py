from pymongo import MongoClient
import numpy as np
import gridfs
import io

print("Hello, MongoDB!")

# Create the connection string
connection_string = "mongodb+srv://akhilmetukuru2016:test1234@cypress.oghgb.mongodb.net/"

# Connect to MongoDB
client = MongoClient(connection_string)

# Test the connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Set up the database and GridFS
db = client['Cypress']
fs = gridfs.GridFS(db)

def insert_frame_data(username, frame_data):
    """
    Insert frame_data (numpy array) into the database with username as the key.
    
    :param username: str, the username to use as the key
    :param frame_data: np.array, the 224x224 image data
    :return: str, the ObjectId of the inserted data
    """
    # Ensure frame_data is the correct shape
    if frame_data.shape != (224, 224):
        raise ValueError("frame_data must be a 224x224 numpy array")
    
    # Convert numpy array to bytes
    frame_bytes = io.BytesIO()
    np.save(frame_bytes, frame_data, allow_pickle=True)
    frame_bytes.seek(0)
    
    # Store the array in GridFS
    file_id = fs.put(frame_bytes, filename=username)
    
    # Store the reference in the user_profiles collection
    db.user_profiles.update_one(
        {"username": username},
        {"$set": {"frame_data_id": file_id}},
        upsert=True
    )
    
    return str(file_id)

def fetch_frame_data(username):
    """
    Fetch the frame data (numpy array) for a given username.
    
    :param username: str, the username to fetch data for
    :return: np.array or None if not found
    """
    # Find the user document
    user_doc = db.user_profiles.find_one({"username": username})
    
    if user_doc and "frame_data_id" in user_doc:
        # Retrieve the file from GridFS
        grid_out = fs.get(user_doc["frame_data_id"])
        
        # Load the numpy array from the file
        frame_data = np.load(io.BytesIO(grid_out.read()), allow_pickle=True)
        
        return frame_data
    else:
        return None