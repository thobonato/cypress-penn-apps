Cypress3 is a cutting-edge triple-factor authentication system that combines liveness detection, facial recognition, and hand gesture recognition to provide unparalleled security for digital identities.
Features

Liveness Detection: Ensures the authenticity of the user's presence.
Facial Recognition: Verifies user identity against stored images.
Hand Gesture Recognition: Adds a dynamic, time-sensitive security layer.
User-Friendly Interface: Simple and intuitive authentication process.
Scalable and Secure: Built on robust, industry-standard technologies.

Tech Stack

Backend: Python 3.8+, FastAPI
Database: MongoDB Atlas
Computer Vision: OpenCV
Gestures Model: Hand Gestures Image Detection by dima806
Facial Recognition: DeepFace
Frontend: [Your frontend technology, e.g., React, Vue, etc.]

Installation

Clone the repository:
bashCopygit clone https://github.com/your-username/cypress-penn-apps.git
cd cypress-penn-apps

Set up a virtual environment:
bashCopypython -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

Install dependencies:
bashCopypip install -r requirements.txt

Set up environment variables:
bashCopycp .env.example .env
# Edit .env with your MongoDB Atlas connection string and other configurations

Run the application:
bashCopyuvicorn app.main:app --reload


Usage

Register a new user by providing a username and uploading a facial image.
During authentication:

The system will perform a liveness check.
Facial recognition will verify the user's identity using DeepFace.
The user will be prompted to perform a specific hand gesture within a given timeframe, recognized by the Hand Gestures Image Detection model.



Contributing
We welcome contributions to Cypress3! Please see our CONTRIBUTING.md for details on how to get started.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

dima806 for the Hand Gestures Image Detection model:(https://huggingface.co/dima806/hand_gestures_image_detection/tree/main)
Sefik Ilkin Serengil for the DeepFace library: (https://github.com/serengil/deepface?tab=readme-ov-file)
OpenCV community for their excellent computer vision library
FastAPI team for the high-performance web framework
MongoDB team for their robust and scalable database solution
