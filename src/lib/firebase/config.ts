
// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID_PLACEHOLDER",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID_PLACEHOLDER",
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
const isFirebaseConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PLACEHOLDER") && firebaseConfig.projectId && !firebaseConfig.projectId.includes("PLACEHOLDER");

if (isFirebaseConfigured) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      console.log("Firebase initialized successfully.");
    } catch (error) {
      console.error("Firebase initialization error:", error);
      // app and auth will remain undefined
    }
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }
} else {
  console.warn(
    "Firebase configuration is incomplete or uses placeholder values. " +
    "Firebase services will not be initialized. " +
    "Please provide your Firebase project configuration in environment variables (e.g., .env.local) " +
    "or directly in src/lib/firebase/config.ts to enable Firebase features."
  );
}

const googleAuthProvider = new GoogleAuthProvider();
if (isFirebaseConfigured) {
  // Add necessary Gmail API scopes only if Firebase is configured
  googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.send');
}

export { app, auth, googleAuthProvider, isFirebaseConfigured };
