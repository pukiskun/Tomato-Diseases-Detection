# 🍅 Tomato Disease Detection App

A mobile application built with **React Native** that leverages **Google Vertex AI** to detect diseases in tomato plants using image recognition.

## ✨ Features

- 📷 Capture or upload images of tomato leaves
- 🧠 Send images to a custom-trained ML model on Vertex AI
- 🩺 Get real-time disease predictions and confidence levels
- 📊 View disease information and prevention tips
- 🌐 Works on both Android and iOS

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo / CLI)
- **Backend**: Google Cloud Functions (optional)
- **ML Model**: Custom Image Classification on Google Vertex AI
- **Storage**: Firebase Storage (for image uploads)
- **Auth**: Firebase Authentication (optional)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/tomato-disease-detector.git
cd tomato-disease-detector

# Install dependencies
npm install
# or
yarn install

# Start the development server
npx expo start
