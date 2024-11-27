# Worklogger

A professional work logging application built with React, Firebase, and Tailwind CSS.

## Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore in your Firebase project
3. Copy your Firebase configuration from Project Settings
4. Create a `.env` file in the root directory
5. Fill in your Firebase configuration values in the `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Development

```bash
npm install
npm run dev
```

## Deployment

The application can be deployed to Netlify. Make sure to:

1. Add all environment variables from your `.env` file to your Netlify project settings
2. Deploy the application

[Edit in StackBlitz ⚡️](https://stackblitz.com/~/github.com/jonasbech/Worklogger)