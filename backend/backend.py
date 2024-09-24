from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64
import random
import numpy as np
from CV.face_recog.inference import DetectFace
from CV.gestures.inference import DetectGesture
import cv2
import mediapipe as mp  # Added import for MediaPipe

prev_result = None  # Initialize global variable

def get_random_gesture(prev=None):
    gestures = [
        # "call",
        "dislike",
        "fist",
        "four",
        "ok",
        "one",
        "palm",
        "peace",
        "peace_inverted",
        # "rock",
        "stop",
        "stop_inverted"
    ]
    available_gestures = [gesture for gesture in gestures if gesture != prev]
    return random.choice(available_gestures)

##### REPLACE WITH DB #####
from deepface import DeepFace
tom_enc = DeepFace.represent(img_path="./CV/face_recog/faces/max.jpg", enforce_detection=False)[0]["embedding"]
prev_result = {
    "result": {
        "spoofing_pass": False,
        "face_recog_pass": False,
        "gesture_pass": {
            "gesture1_complete": False,
            "gesture2_complete": False,
            "gesture3_complete": False
        },
        "next_random_gesture": get_random_gesture(""),
        "time_left": 45
    }
}
############################

app = FastAPI()
gesture_model = DetectGesture("./CV/gestures/gestures_model")
face_model = DetectFace()

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands_detector = mp_hands.Hands(
    static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5
)

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
    return {"message": "Hello diddlers"}

@app.post("/api/stream-feed")
async def stream_data(frame_json: dict):
    global prev_result  # Declare prev_result as global

    try:
        frame_data = frame_json.get('frame_data')

        # Convert frame_data to image
        _, encoded = frame_data.split(",", 1)
        image_data = base64.b64decode(encoded)
        np_image = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        ### <<< Facial Recognition >>>
        spoofing = bool(prev_result["result"]["spoofing_pass"])
        faceid = bool(prev_result["result"]["face_recog_pass"])

        # Determine if we need to run inference
        run_inference = not (spoofing is False and faceid is True)

        if run_inference:
            face_res = face_model.run_inference(image, tom_enc)  # Replace with DB as needed
            
            # Update faceid
            faceid = bool(face_res["faceID_passed"]) or faceid
            
            # Update spoofing
            if faceid:
                spoofing = bool(face_res["spoofing"]) or spoofing
            else:
                spoofing = spoofing  # Keep previous spoofing result if faceid failed

        print(f"\n\nSPOOFING: {spoofing}, FACEID:{faceid}\n\n")

        # Display messages based on results
        if not faceid:
            print("Face ID failed. Please try again.")
        elif spoofing:
            print("Spoofing detected. Access denied.")
        else:
            print("Face ID passed and no spoofing detected. Access granted.")

        ### <<< Gesture Recognition >>>
        gestures = [False, False, False]
        next_random_gesture = None

        if not spoofing and faceid:
            prev_gestures = list(prev_result["result"]["gesture_pass"].values())
            print(f"Previous Gestures: {prev_gestures}")

            # Process the image with MediaPipe Hands
            results = hands_detector.process(image)

            for index, gest in enumerate(prev_gestures):
                if not gest:
                    # Run inference if a hand is detected
                    if results.multi_hand_landmarks:
                        hand_landmarks = results.multi_hand_landmarks[0]

                        # Get bounding box coordinates
                        h, w, _ = image.shape
                        x_max, y_max = 0, 0
                        x_min, y_min = w, h
                        for lm in hand_landmarks.landmark:
                            x, y = int(lm.x * w), int(lm.y * h)
                            x_max = max(x_max, x)
                            x_min = min(x_min, x)
                            y_max = max(y_max, y)
                            y_min = min(y_min, y)

                        # Add padding to the bounding box
                        padding = 80
                        y_min = max(0, y_min - padding)
                        y_max = min(h, y_max + padding)
                        x_min = max(0, x_min - padding)
                        x_max = min(w, x_max + padding)

                        # Extract hand region
                        hand_region = image[y_min:y_max, x_min:x_max]

                        # Run gesture recognition inference on hand region
                        probs, classes, time_elapsed = gesture_model.run_inference(hand_region)

                        # Check if the predicted gesture matches the expected one
                        expected_gesture = prev_result["result"]["next_random_gesture"]
                        if expected_gesture in classes:
                            # Update gesture completion
                            gestures[index] = True
                            print(f"Gesture '{expected_gesture}' recognized.")

                        print(classes)

                    else:
                        # No hand detected
                        print("No hand detected.")
                        gestures[index] = False

                    break

            if True in gestures:
                next_random_gesture = get_random_gesture(prev_result["result"]["next_random_gesture"])
            else:
                next_random_gesture = prev_result["result"]["next_random_gesture"]

            print(f"Next random gesture: {next_random_gesture}")

        # Ensure next_random_gesture is set
        next_random_gesture = next_random_gesture or prev_result["result"]["next_random_gesture"]

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    # Prepare the response
    res = {
        "result": {
            "spoofing_pass": spoofing,
            "face_recog_pass": faceid,
            "gesture_pass": {
                "gesture1_complete": bool(gestures[0] or prev_result["result"]["gesture_pass"]["gesture1_complete"]),
                "gesture2_complete": bool(gestures[1] or prev_result["result"]["gesture_pass"]["gesture2_complete"]),
                "gesture3_complete": bool(gestures[2] or prev_result["result"]["gesture_pass"]["gesture3_complete"]),
            },
            "next_random_gesture": next_random_gesture,
            "time_left": prev_result["result"]["time_left"] - 1
        }
    }

    prev_result = res  # Update the global prev_result

    return res

@app.post("/api/send-db")
async def send_db(frame_json: dict):
    try:
        frame_data = frame_json.get('frame_data')
        username = frame_json.get('username')
        document = {
            "username": username,
            "frame_data": []  # Placeholder for frame data
        }

        print(f"Username: {username}")
        print(f"Frame data received.")

        # Insert document into MongoDB or your database
        # result = collection.insert_one(document)

        # Check if insertion was successful
        # if result.inserted_id:
        return {"success": True}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to insert data")
    
@app.post("/api/send-db")
async def send_db(frame_json: dict):
    try:
        frame_data = frame_json.get('frame_data')
        username = frame_json.get('username')
        document = {
            "username": username,
            "frame_data": []  # Placeholder for frame data
        }

        print(f"Username: {username}")
        print(f"Frame data received.")

        # Insert document into MongoDB or your database
        # result = collection.insert_one(document)

        # Check if insertion was successful
        # if result.inserted_id:
        return {"success": True}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to insert data")
    
@app.get("/api/check-auth")
async def check_auth_val():
    auth = prev_result["result"]["gesture_pass"]["gesture1_complete"]
    return {"authenticated": auth}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
