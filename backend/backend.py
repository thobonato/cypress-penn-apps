from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allows all origins for CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello Diddlers"}

@app.get("/api/stream-feed")
async def stream_data(frame_data: str):
    try:
        print(frame_data)
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"spoofing": False,
            "face_recog":True,
            "gestures":True}

@app.post("/api/send-db")
async def stream_data(username, frame_data):
    try:
        # Convert frame_data string to numpy array
        np_array = np.fromstring(frame_data, sep=',')
        
        # Create document to insert
        document = {
            "username": username,
            "frame_data": np_array.tolist()  # Convert np array to list for MongoDB storage
        }
        
        # Insert document into MongoDB
        result = collection.insert_one(document)
        
        # Check if insertion was successful
        if result.inserted_id:
            return {"success": True}
        else:
            raise HTTPException(status_code=500, detail="Failed to insert data")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}"

    
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)