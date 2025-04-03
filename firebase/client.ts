import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "prepwise-daac4.firebaseapp.com",
  projectId: "prepwise-daac4",
  storageBucket: "prepwise-daac4.firebasestorage.app",
  messagingSenderId: "830528474613",
  appId: "1:830528474613:web:1cc3ae5e249731929de4bc",
  measurementId: "G-DNES1G80T5",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
