// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCBFoVtoK7yZhQzun4zbSH_aAVjf0iZFvU",
  authDomain: "campus-canteen-89549.firebaseapp.com",
  projectId: "campus-canteen-89549",
  storageBucket: "campus-canteen-89549.firebasestorage.app",
  messagingSenderId: "452643484496",
  appId: "1:452643484496:web:7c9d9017679578c8c5b255",
  measurementId: "G-DDFCMLK4J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
