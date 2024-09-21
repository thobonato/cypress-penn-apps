from deepface import DeepFace
import cv2 
import time
from PIL import Image
import numpy as np

josh_enc = DeepFace.represent(img_path = "./faces/josh.JPG")

cap = cv2.VideoCapture(0)  # Use 0 for default camera

if not cap.isOpened():
    print("Error: Could not open camera.")

last_inference_time = time.time()
inference_interval = 2.0  # 2 seconds
current_prediction = "None yet"

while True:
    time.sleep(inference_interval)
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break

    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)   

    img = Image.fromarray(np.uint8(frame)).convert('RGB')
    img.save("./faces/temp.png")

    # frame_enc = DeepFace.(frame)
    # print(f"Frame_enc: {frame_enc}")
    result = DeepFace.verify(
        img1_path = "./faces/josh.JPG",
        img2_path = "./faces/temp.png",
        enforce_detection = False
        )

    print(f"Result: {result}")
    
    # cv2.putText(frame, current_prediction, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 0), 2)
    # cv2.imshow('Gesture Detection', frame)

    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()