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
async def stream_data(frame_data: str):
    try:
        pass
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)