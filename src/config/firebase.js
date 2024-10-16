// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbITWf0v9BPFd5REuxpnlALVfaV2k0afA",
  authDomain: "toolmate-43458.firebaseapp.com",
  projectId: "toolmate-43458",
  storageBucket: "toolmate-43458.appspot.com",
  messagingSenderId: "572368589721",
  appId: "1:572368589721:web:d2d6044ac2960f9cb8b908",
  measurementId: "G-332YXE5WJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);