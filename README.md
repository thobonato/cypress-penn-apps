# Cypress3

Cypress3 is a cutting-edge triple-factor authentication system that combines liveness detection, facial recognition, and hand gesture recognition to provide unparalleled security for digital identities.

## Features

- **Liveness Detection:** Ensures the authenticity of the user's presence.
- **Facial Recognition:** Verifies user identity against stored images.
- **Hand Gesture Recognition:** Adds a dynamic, time-sensitive security layer.
- **User-Friendly Interface:** Simple and intuitive authentication process.
- **Scalable and Secure:** Built on robust, industry-standard technologies.

## Tech Stack

- **Backend:** Python 3.8+, FastAPI
- **Database:** MongoDB Atlas
- **Computer Vision:** OpenCV
- **Gestures Model:** Hand Gestures Image Detection by dima806
- **Facial Recognition:** DeepFace
- **Frontend:** React

## Installation

```bash
git clone https://github.com/your-username/cypress-penn-apps.git
cd cypress-penn-apps
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string and other configurations
Run the Application
```bash
uvicorn app.main:app --reload
Usage
Register a new user by providing a username and uploading a facial image. During authentication:
```
The system will perform a liveness check.
Facial recognition will verify the user's identity using DeepFace.
The user will be prompted to perform a specific hand gesture within a given timeframe, recognized by the Hand Gestures Image Detection model.

## Contributing
We welcome contributions to Cypress3! Please see our CONTRIBUTING.md for details on how to get started.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

##Acknowledgments
- dima806 for the Hand Gestures Image Detection model
- Sefik Ilkin Serengil for the DeepFace library
- OpenCV community for their excellent computer vision library
- FastAPI team for the high-performance web framework
- MongoDB team for their robust and scalable database solution
