from transformers import ViTImageProcessor, ViTForImageClassification
print("Import successful")

from PIL import Image
import torch
import torch.nn.functional as F
import time
import cv2
import numpy as np

class DetectGesture:
    def __init__(self, model_path, threshold=0.7):
        self.image_processor = ViTImageProcessor.from_pretrained(model_path)
        self.model = ViTForImageClassification.from_pretrained(model_path)
        self.probability_threshold = threshold
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.model.eval()

    def _process_image(self, image):
        if isinstance(image, str):
            image = Image.open(image).convert("RGB")
        elif isinstance(image, np.ndarray):
            image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        inputs = self.image_processor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        return inputs

    def run_inference(self, image):
        start_time = time.time()
        inputs = self._process_image(image)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits

        probabilities = F.softmax(logits, dim=-1)
        top_probs, top_indices = torch.topk(probabilities, 3, dim=-1)
        
        top_probs = top_probs.squeeze().tolist()
        top_classes = [self.model.config.id2label[idx.item()] for idx in top_indices.squeeze()]

        res_probs = []
        res_classes = []
        for prob, class_name in zip(top_probs, top_classes):
            if prob > self.probability_threshold:
                res_probs.append(prob)
                res_classes.append(class_name)

        time_elapsed = time.time() - start_time
        return res_probs, res_classes, time_elapsed