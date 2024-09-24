from deepface import DeepFace
from PIL import Image
import cv2
import time
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from deepface.modules import verification
import base64

class DetectFace:
    def __init__(self):
        self.threshold = verification.find_threshold("VGG-Face", "cosine")

    def _process_frame(self, frame):
        # implement this to get image from array and turn into Image object
        img = Image.fromarray(frame)

        return img
    
    def get_encoding(self, frame_data):
        # Convert frame_data to image
        _, encoded = frame_data.split(",", 1)
        image_data = base64.b64decode(encoded)
        np_image = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        frame_enc = DeepFace.represent(img_path=image, enforce_detection=False)[0]["embedding"]
        return frame_enc

    def run_inference(self, frame, user_image_enc):
        """
        Compares user_image_enc to frame.
        """
        try:
            face_objs = DeepFace.extract_faces(img_path=frame, detector_backend='opencv', enforce_detection=False, anti_spoofing=True)
        except Exception as e:
            print("Error: Face recognition pipeline.")
            return None
        
        if face_objs:
            
            if face_objs[0]["is_real"]:

                frame_enc = DeepFace.represent(img_path=frame, enforce_detection=False)[0]["embedding"]
                similarity = verification.find_distance(user_image_enc, frame_enc, "cosine")

                spoofing = False
                faceID_passed = similarity <= self.threshold

            
            else:
                spoofing = True
                faceID_passed = False

        else:
            spoofing = False
            faceID_passed = False

        result = {"spoofing": spoofing,
                  "faceID_passed": faceID_passed}
        
        return result