from transformers import ViTImageProcessor, ViTForImageClassification         # attempt 1
from PIL import Image
import torch
import torch.nn.functional as F
import time
import cv2

class DetectGesture():

    def __init__(self, model_path, threshold=0.7) -> None:
        self.image_processor = ViTImageProcessor.from_pretrained(model_path)
        self.model = ViTForImageClassification.from_pretrained(model_path)
        self.probability_threshold = threshold

    def _load_image(self, image_path):
        image = Image.open(image_path)
        inputs = self.image_processor(images=image, return_tensors="pt")
        return inputs
    
    def _process_image(self, image):
        pil_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # trying grayscale
        
        resized_image = cv2.resize(pil_image, (64, 64))
        
        inputs = self.image_processor(images=resized_image, return_tensors="pt")

        return inputs
    
    def run_inference(self, image, top_k=3):
        time_span = time.time()
        # inputs = self._load_image(image)
        if isinstance(image, str):
            inputs = self._load_image(image)
        else:
            inputs = self._process_image(image)
        

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits

        # Apply softmax to get probabilities
        probabilities = F.softmax(logits, dim=-1)
        
        # Get the top 3 probabilities and class indices
        top3_probs, top3_indices = torch.topk(probabilities, 2, dim=-1)
        
        # Convert to lists
        top3_probs_list = top3_probs.squeeze().tolist()
        top3_classes_list = [self.model.config.id2label[idx.item()] for idx in top3_indices.squeeze()]

        res_probs = []
        res_classes = []
        for i, prob in enumerate(top3_probs_list):
            if prob > self.probability_threshold:
                res_probs.append(prob)
                res_classes.append(top3_classes_list[i])

        
        time_elapsed = time.time() - time_span
        
        return (res_probs, res_classes, time_elapsed)