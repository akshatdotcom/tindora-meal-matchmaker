// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEA2h3857keqif3-s33R1M3hSJGmgrh10",
  authDomain: "tindora-c728d.firebaseapp.com",
  projectId: "tindora-c728d",
  storageBucket: "tindora-c728d.appspot.com",
  messagingSenderId: "1082066929556",
  appId: "1:1082066929556:web:b7c190561ff90c7892b181",
  measurementId: "G-045VNNRPY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);