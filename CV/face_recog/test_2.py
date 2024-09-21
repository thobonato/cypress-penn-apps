from deepface import DeepFace

# anti spoofing test in face detection
try:
    face_objs = DeepFace.extract_faces(
    img_path="faces/diddler.jpg",
    anti_spoofing = True,
    )
except Exception as e:
    print(e)
    face_objs = None

if face_objs:
    print(face_objs)
    print(face_objs[0])
    print(face_objs[0]["is_real"])