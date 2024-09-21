from inference import DetectGesture
import cv2

model = DetectGesture("./gestures_model", threshold=0.6)
cap = cv2.VideoCapture(0)



while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break
    
    cv2.imshow('Test Frame', frame)
    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()