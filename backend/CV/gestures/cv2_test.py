from inference import DetectGesture
import time
import cv2
import mediapipe as mp

asl_detector = DetectGesture("./gestures_model", threshold=0.6)
cap = cv2.VideoCapture(0)  # Use 0 for default camera

print("Running...")

if not cap.isOpened():
    print("Error: Could not open camera.")

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

last_inference_time = time.time()
inference_interval = 1.0  # 2 seconds
current_prediction = "None yet"

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break

    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)   
    
    # Process the image and get hand landmarks
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw hand landmarks
            # mp_drawing.draw_laqqndmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Get bounding box coordinates
            h, w, _ = frame.shape
            x_max, y_max = 0, 0
            x_min, y_min = w, h
            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                if x > x_max:
                    x_max = x
                if x < x_min:
                    x_min = x
                if y > y_max:
                    y_max = y
                if y < y_min:
                    y_min = y

            # Add padding to the bounding box
            padding = 80
            y_min = max(0, y_min - padding)
            y_max = min(h, y_max + padding)
            x_min = max(0, x_min - padding)
            x_max = min(w, x_max + padding)

            # Draw bounding box
            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 0, 0), 3)

            # Extract hand region
            hand_region = frame[y_min:y_max, x_min:x_max]

            # Run inference if enough time has passed
            current_time = time.time()
            if current_time - last_inference_time >= inference_interval:
                # predicted_class, max_prob, inference_time = asl_detector.run_inference(hand_region)
                probs, classes, time_elapsed = asl_detector.run_inference(hand_region)
                print(f"Predicted Gesture: {classes}, Probability: {probs}, Inference Time: {time_elapsed:.4f}s")
                current_prediction = f"Predicted: {classes}"
                last_inference_time = current_time

    else:
        current_prediction="No hand"
    
    cv2.putText(frame, current_prediction, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 0), 2)
    cv2.imshow('Gesture Detection', frame)

    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()