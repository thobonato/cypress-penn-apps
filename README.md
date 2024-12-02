# CypressMFA ([Devpost](https://devpost.com/software/cypress-mfa))

CypressMFA is a cutting-edge, triple-factor authentication system designed to secure user identities through a combination of liveness detection, facial recognition, and hand gesture recognition. Built with the modern-day security challenges in mind, this solution adds an extra layer of protection that is both robust and user-friendly. The system is packaged as a Chrome extension, allowing seamless integration across various websites and applications.

## Inspiration

The inspiration for CypressMFA came from the growing need for more secure and adaptive multi-factor authentication (MFA) systems. With the rise of digital security threats, businesses and individuals are more reliant on digital identities than ever before. The need to secure access to these digital services has never been more important. We sought to create a solution that not only enhances security but also remains adaptable to various industry use cases. By embedding the system into a Chrome extension, we ensure it is widely accessible and easily usable across multiple platforms.

## What It Does

CypressMFA combines three key elements to verify the identity of users:
1. **Liveness Detection**: Ensures the person attempting access is live, preventing spoofing through static images or videos.
2. **Facial Recognition**: Utilizes state-of-the-art facial recognition technology to identify the user.
3. **Hand Gesture Recognition**: Adds an additional layer of security by requiring a specific hand gesture, making it much more difficult for impostors to gain access.

The system is designed as a **Chrome extension** that can be easily installed and used across a variety of websites. This approach provides users with a secure and convenient authentication experience regardless of the web platform they are using.

## How We Built It

CypressMFA was developed using a robust tech stack to ensure efficiency, scalability, and security:
- **Backend**: Built with Python and FastAPI for high-performance web handling.
- **Database**: We utilized MongoDB Atlas for scalable, cloud-based database management.
- **Image Processing**: For real-time image and video processing, we integrated the OpenCV library.
- **Facial Recognition**: Leveraged the DeepFace library to perform accurate facial recognition.
- **Hand Gesture Recognition**: Implemented using a pre-trained model from dima806, which was adapted to suit our specific requirements.
- **Chrome Extension**: The system is integrated into a Chrome extension that interacts with the web browser, enabling authentication across different websites.

### Tech Stack:
- **Programming Language**: Python
- **Web Framework**: FastAPI
- **Database**: MongoDB Atlas
- **Libraries**: OpenCV, DeepFace
- **Gesture Model**: dima806 Hand Gesture Recognition
- **Chrome Extension**: JavaScript for interaction with web elements

## Challenges We Ran Into

Developing CypressMFA came with a number of challenges:
- **Liveness and Facial Recognition Accuracy**: Ensuring accurate recognition in varying lighting conditions was a key obstacle. We had to fine-tune our models to perform well in real-time.
- **Hand Gesture Integration**: Making the hand gesture recognition system responsive, dynamic, and secure was more complex than initially anticipated.
- **Chrome Extension Integration**: Ensuring the extension worked smoothly across various websites and platforms required a well-architected interface between the browser, the backend, and the web pages.
- **Scalability**: Ensuring the system was scalable without compromising on security or performance required careful design and testing.

## Accomplishments That We're Proud Of

We’re proud of a few significant achievements:
- **Real-Time Security**: CypressMFA performs security checks in real-time without compromising performance or user experience.
- **Cross-Platform Compatibility**: By making the system available as a Chrome extension, users can securely authenticate on a variety of websites.
- **Balance Between Security & Usability**: We achieved a balance between high-level security and maintaining a user-friendly interface.
- **Scalability**: The architecture is built to scale efficiently, allowing the system to handle a growing number of users while keeping security robust.

## What We Learned

Through the development process of CypressMFA, we gained valuable insights:
- **Machine Learning Models**: We learned a great deal about optimizing machine learning models for real-time image processing and gesture recognition.
- **Backend Development**: We enhanced our skills in backend development, particularly in integrating various technologies.
- **Browser Extension Development**: Building the Chrome extension taught us how to effectively integrate authentication mechanisms into browsers for seamless cross-platform use.
- **Security Trade-offs**: Finding a balance between stringent security measures and user experience taught us about the trade-offs in building robust authent
