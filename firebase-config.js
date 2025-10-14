
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "jah-and-co-dev.firebaseapp.com",
  projectId: "jah-and-co-dev",
  storageBucket: "jah-and-co-dev.firebasestorage.app",
  messagingSenderId: "451434139963",
  appId: "1:451434139963:web:b4bfbffc472678c4c3671e",
  measurementId: "G-N6L3JN4604"
};

export const app = initializeApp(firebaseConfig);
