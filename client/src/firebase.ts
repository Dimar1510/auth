// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "real-estate-41b4a.firebaseapp.com",
  projectId: "real-estate-41b4a",
  storageBucket: "real-estate-41b4a.appspot.com",
  messagingSenderId: "8757031008",
  appId: "1:8757031008:web:61af76bbff3a150a9b9305",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
