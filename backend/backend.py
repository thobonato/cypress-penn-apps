from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64



app = FastAPI()

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
async def stream_data(frame_json: dict):
    try:
        frame_data = frame_json.get('frame_data')
        username = frame_json.get('username')

        

        print(username)
        print(frame_data)

        # Process frame_data and username here
        return {"success": True}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)