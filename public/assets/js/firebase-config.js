import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// Firebase configuration
// In production, use environment variables or a secure config management system
// For now, we use a fallback to the existing config for backwards compatibility
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyAVVrmwHH8E6Gc613aO4WfCJuGP9DdpLOM",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "jah-and-co-dev.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "jah-and-co-dev",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "jah-and-co-dev.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "451434139963",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:451434139963:web:b4bfbffc472678c4c3671e",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-N6L3JN4604"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
