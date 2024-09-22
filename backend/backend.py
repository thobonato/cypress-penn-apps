from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64
from CV.face_recog.inference import DetectFace
from CV.gestures.inference import DetectGesture



app = FastAPI()
gesture_model = DetectGesture("./CV/gestures/gestures_model")
face_model = DetectFace()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allows all origins for CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FrameData(BaseModel):
    frame_data: str
    username: str

@app.get("/")
async def root():
    return {"message": "Hello Diddlers"}

@app.post("/api/stream-feed")
async def stream_data(frame_json: dict):
    try:
        frame_data = frame_json.get('frame_data')

        print(frame_data)

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    # Process the frame data and return the result
    
    return {"result": {"spoofing_pass": True,
                "face_recog_pass": True,
                "gesture_pass": { "gesture1_complete": True,
                                "gesture2_complete": False,
                                "gesture3_complete": False},
                "next_random_gesture": "peace",
                "time_left": 30}
            }

@app.post("/api/send-db")
async def stream_data(frame_json: dict):
    try:
        frame_data = frame_json.get('frame_data')
        username = frame_json.get('username')
        document = {
            "username": username,
            "frame_data": [] #np_array.tolist()  # Convert np array to list for MongoDB storage
        }

        print(username)
        print(frame_data)

                # Insert document into MongoDB
        # result = collection.insert_one(username, frame_data)
        
        # Check if insertion was successful
        # if result.inserted_id:
        return {"success": True}
    except:
        raise HTTPException(status_code=500, detail="Failed to insert data")
    
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)