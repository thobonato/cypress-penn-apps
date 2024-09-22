<<<<<<< HEAD
# from deepface import DeepFace
# import cv2
# import time
# import numpy as np
# from concurrent.futures import ThreadPoolExecutor
# from deepface.modules import verification



# # Load josh's face encoding once
# josh_enc = DeepFace.represent(img_path="./faces/josh.jpg", enforce_detection=False)[0]["embedding"]     # REPLACE WITH DB
# tom_enc = DeepFace.represent(img_path="./faces/tom.jpg", enforce_detection=False)[0]["embedding"]     # REPLACE WITH DB
# akhil_enc = DeepFace.represent(img_path="./faces/akhil.jpg", enforce_detection=False)[0]["embedding"]     # REPLACE WITH DB

# cap = cv2.VideoCapture(0)
# if not cap.isOpened():
#     print("Error: Could not open camera.")
#     exit()

# inference_interval = 2.0  # 2 seconds
# current_prediction = "None yet"
# last_inference_time = time.time() - inference_interval  # Ensure first frame is processed

# # Create a thread pool
# executor = ThreadPoolExecutor(max_workers=1)
# future = None

# def process_frame(frame):
#     try:
#         # Extract face and check for spoofing
#         face_objs = DeepFace.extract_faces(img_path=frame, detector_backend='opencv', enforce_detection=False, anti_spoofing=True)
        
#         if face_objs and face_objs[0]["is_real"]:
#             # Get face encoding
#             frame_enc = DeepFace.represent(img_path=frame, enforce_detection=False)[0]["embedding"]
            
#             # Compare with our encodings
#             similarity = verification.find_distance(tom_enc, frame_enc, "cosine")
                
            
#             threshold = verification.find_threshold("VGG-Face", "cosine")
#             result = similarity <= threshold
#         else:
#             result = "False--Spoofing"
        
#         return result
#     except Exception as e:
#         print(f"Error in processing: {e}")
#         return "Error"

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("Error: Failed to capture frame.")
#         break

#     current_time = time.time()

#     # Start a new inference if it's time and no inference is currently running
#     if current_time - last_inference_time >= inference_interval and (future is None or future.done()):
#         last_inference_time = current_time
#         future = executor.submit(process_frame, frame)

#     # Check if the future is done and update the result
#     if future and future.done():
#         try:
#             current_prediction = future.result()
#         except Exception as e:
#             print(f"Error getting result: {e}")
#             current_prediction = "Error"

#     # Display the result
#     cv2.putText(frame, str(current_prediction), (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
#     cv2.imshow('Face Recognition', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()
# executor.shutdown()

from inference import DetectFace
from PIL import Image
from deepface import DeepFace
import numpy as np

pic = Image.open("./faces/tom_spoof.jpg")
pix = np.array(pic)

tom_enc = DeepFace.represent(img_path="./faces/tom.jpg", enforce_detection=False)[0]["embedding"] 


mdl = DetectFace()
print(mdl.run_inference(pix, tom_enc))
=======
from deepface import DeepFace
import cv2
import time
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from deepface.modules import verification



# Load josh's face encoding once
josh_enc = DeepFace.represent(img_path="./faces/josh.JPG", enforce_detection=False)[0]["embedding"]     # REPLACE WITH DB

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

inference_interval = 2.0  # 2 seconds
current_prediction = "None yet"
last_inference_time = time.time() - inference_interval  # Ensure first frame is processed

# Create a thread pool
executor = ThreadPoolExecutor(max_workers=1)
future = None

def process_frame(frame):
    try:
        # Extract face and check for spoofing
        face_objs = DeepFace.extract_faces(img_path=frame, detector_backend='opencv', enforce_detection=False, anti_spoofing=True)
        
        if face_objs and face_objs[0]["is_real"]:
            # Get face encoding
            frame_enc = DeepFace.represent(img_path=frame, enforce_detection=False)[0]["embedding"]
            
            # Compare with Josh's encoding
            similarity = verification.find_distance(josh_enc, frame_enc, "cosine")
            threshold = verification.find_threshold("VGG-Face", "cosine")
            result = similarity <= threshold
        else:
            result = "False--Spoofing"
        
        return result
    except Exception as e:
        print(f"Error in processing: {e}")
        return "Error"

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break

    current_time = time.time()

    # Start a new inference if it's time and no inference is currently running
    if current_time - last_inference_time >= inference_interval and (future is None or future.done()):
        last_inference_time = current_time
        future = executor.submit(process_frame, frame)

    # Check if the future is done and update the result
    if future and future.done():
        try:
            current_prediction = future.result()
        except Exception as e:
            print(f"Error getting result: {e}")
            current_prediction = "Error"

    # Display the result
    cv2.putText(frame, str(current_prediction), (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow('Face Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
executor.shutdown()
>>>>>>> refs/remotes/origin/main
