// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const API_BASE_URL = 'https://studswap.onrender.com';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFP5mgOT-IgQej8oz5QYBaR_rU7z_WURs",
  authDomain: "studswap-9a555.firebaseapp.com",
  projectId: "studswap-9a555",
  storageBucket: "studswap-9a555.firebasestorage.app",
  messagingSenderId: "412686892424",
  appId: "1:412686892424:web:cfa4f204ff2c2196278e3d",
  measurementId: "G-P5KW640216"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);