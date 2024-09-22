# CypressMFA

cypressMFA is a cutting-edge, triple-factor authentication system designed to secure user identities through a combination of liveness detection, facial recognition, and hand gesture recognition. Built with the modern-day security challenges in mind, this solution adds an extra layer of protection that is both robust and user-friendly.

## Inspiration

The inspiration for cypressMFA came from the growing need for more secure and adaptive multi-factor authentication (MFA) systems. With the rise of digital security threats, businesses and individuals are more reliant on digital identities than ever before. The need to secure access to these digital services has never been more important. We sought to create a solution that not only enhances security but also remains adaptable to various industry use cases.

## What It Does

cypressMFA combines three key elements to verify the identity of users:
1. **Liveness Detection**: Ensures the person attempting access is live, preventing spoofing through static images or videos.
2. **Facial Recognition**: Utilizes state-of-the-art facial recognition technology to identify the user.
3. **Hand Gesture Recognition**: Adds an additional layer of security by requiring a specific hand gesture, making it much more difficult for impostors to gain access.

The result is a highly secure system that is incredibly difficult to spoof while maintaining ease of use for legitimate users.

## How We Built It

cypressMFA was developed using a robust tech stack to ensure efficiency, scalability, and security:
- **Backend**: Built with Python and FastAPI for high-performance web handling.
- **Database**: We utilized MongoDB Atlas for scalable, cloud-based database management.
- **Image Processing**: For real-time image and video processing, we integrated the OpenCV library.
- **Facial Recognition**: Leveraged the DeepFace library to perform accurate facial recognition.
- **Hand Gesture Recognition**: Implemented using a pre-trained model from dima806, which was adapted to suit our specific requirements.

### Tech Stack:
- **Programming Language**: Python
- **Web Framework**: FastAPI
- **Database**: MongoDB Atlas
- **Libraries**: OpenCV, DeepFace
- **Gesture Model**: dima806 Hand Gesture Recognition

## Challenges We Ran Into

Developing cypressMFA came with a number of challenges:
- **Liveness and Facial Recognition Accuracy**: Ensuring accurate recognition in varying lighting conditions was a key obstacle. We had to fine-tune our models to perform well in real-time.
- **Hand Gesture Integration**: Making the hand gesture recognition system responsive, dynamic, and secure was more complex than initially anticipated.
- **Scalability**: Ensuring the system was scalable without compromising on security or performance required careful design and testing.

## Accomplishments That We're Proud Of

We’re proud of a few significant achievements:
- **Real-Time Security**: cypressMFA performs security checks in real-time without compromising performance or user experience.
- **Balance Between Security & Usability**: We achieved a balance between high-level security and maintaining a user-friendly interface.
- **Scalability**: The architecture is built to scale efficiently, allowing the system to handle a growing number of users while keeping security robust.

## What We Learned

Through the development process of cypressMFA, we gained valuable insights:
- **Machine Learning Models**: We learned a great deal about optimizing machine learning models for real-time image processing and gesture recognition.
- **Backend Development**: We enhanced our skills in backend development, particularly in integrating various technologies.
- **Security Trade-offs**: Finding a balance between stringent security measures and user experience taught us about the trade-offs in building robust authentication systems.

## What's Next for cypressMFA

Our next steps include:
- **Expanding Biometric Features**: We plan to add more biometric authentication methods to increase security and flexibility.
- **Enhancing ML Algorithms**: Improving the machine learning algorithms to make the system more adaptable to different environments and user scenarios.
- **Mobile Version**: We aim to develop a mobile version of cypressMFA to make it even more accessible.
- **Blockchain Integration**: Exploring the integration of blockchain technology for secure identity verification processes.

## Authors
- Akhil Metukuru
- Thomaz Bonato
- Pranavh (Joshua) Vallabhaneni

## Acknowledgments
We would like to express our gratitude to the following:
- **dima806** for the Hand Gestures Image Detection model
- **Sefik Ilkin Serengil** for the DeepFace library
- **OpenCV community** for their excellent computer vision library
- **FastAPI team** for the high-performance web framework
- **MongoDB team** for their robust and scalable database solution
