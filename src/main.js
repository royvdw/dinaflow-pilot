// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsXwIhCRlMSyxwD5FCVh_cIpkhIX-bMj0",
  authDomain: "dinaflow-pilot.firebaseapp.com",
  projectId: "dinaflow-pilot",
  storageBucket: "dinaflow-pilot.firebasestorage.app",
  messagingSenderId: "689311326041",
  appId: "1:689311326041:web:f7d8b283ec7385794db648",
  measurementId: "G-RV0CFBZ979",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Voorbeeld: Simple interactie
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  });
});
