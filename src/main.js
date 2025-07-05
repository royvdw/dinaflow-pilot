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
  const contactForm = document.getElementById("pilot-form");
  const formMessage = document.getElementById("formMessage");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Voorkom standaard formulierverzending

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // De URL van je Firebase Function. Deze is pas bekend NA het deployen.
    // VOOR NU: laat deze leeg of gebruik een placeholder.
    // Zodra je gedeployed hebt, vind je de URL in de Firebase Console onder Functions.
    const firebaseFunctionUrl =
      "https://sendmailoverhttp-s6dtwf7rda-uc.a.run.app"; // *** BELANGRIJK: VERVANG DEZE! ***

    if (
      !firebaseFunctionUrl ||
      firebaseFunctionUrl === "https://sendmailoverhttp-s6dtwf7rda-uc.a.run.app"
    ) {
      formMessage.textContent =
        "Fout: Firebase Function URL is nog niet geconfigureerd.";
      formMessage.className = "message error";
      return;
    }

    formMessage.textContent = "Verzenden...";
    formMessage.className = "message";

    try {
      const response = await fetch(firebaseFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Voor extra veiligheid: Overweeg een API Key of een simpel token
          // Echter, voor een simpel contactformulier is dit vaak overkill
          // en een POST naar een HTTPS endpoint is al redelijk veilig.
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        formMessage.textContent =
          result.message || "Bericht succesvol verzonden!";
        formMessage.className = "message success";
        contactForm.reset(); // Formulier resetten na succesvolle verzending
      } else {
        const errorData = await response.json();
        formMessage.textContent =
          errorData.error || "Er is een fout opgetreden bij het verzenden.";
        formMessage.className = "message error";
      }
    } catch (error) {
      console.error("Fout bij verzenden:", error);
      formMessage.textContent =
        "Netwerkfout: controleer je internetverbinding.";
      formMessage.className = "message error";
    }
  });

  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  });
});
