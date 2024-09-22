from deepface import DeepFace
from PIL import Image
import cv2
import time
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from deepface.modules import verification

class DetectFace:
    def __init__(self,threshold=0.0):
        self.threshold = threshold if threshold else verification.find_threshold("VGG-Face", "cosine")

    def _process_frame(self, frame):
        # implement this to get image from array and turn into Image object
        img = Image.fromarray(frame)

        return img

    def run_inference(self, frame, user_image_enc):
        """
        Compares user_image_enc to frame.
        """
        print(type(frame))
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