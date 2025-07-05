// IMPORTEER SPECIFIEKE FUNCTIES VAN FIREBASE-ADMIN
import { initializeApp } from "firebase-admin/app";

// IMPORTEER ANDERE AFHANKELIJKHEDEN
import * as functions from "firebase-functions";
import cors from "cors";
import * as nodemailer from "nodemailer";

// INITIALISEER DE FIREBASE ADMIN SDK (dit moet altijd bovenaan)
initializeApp();

// Initialiseer CORS handler.
// Voor productie: vervang 'true' door de exacte URL van je frontend (bijv. 'https://www.jouwwebsite.nl')
const corsHandler = cors({
  origin: true,
});

import { defineSecret } from "firebase-functions/params";
const mailEmailUser = defineSecret("EMAIL_ADRES");
const mailPasswordUser = defineSecret("EMAIL_WACHTWOORD");

// Definieer de Firebase Function.
// BELANGRIJK: Gebruik .runWith({ secrets: [...] }) om de secrets te koppelen.
// Deze geheimen (EMAIL_ADRES, EMAIL_WACHTWOORD) moeten al zijn aangemaakt in Google Secret Manager
// en je Firebase Functions serviceaccount moet de 'Secret Manager Secret Accessor' rol hebben.
export const sendMailOverHTTP = functions.https.onRequest(
  { secrets: [mailEmailUser, mailPasswordUser] },
  (req, res) => {
    console.log(req);

    // Gebruik de corsHandler om CORS-headers in te stellen.
    // We gebruiken hier async/await om de Nodemailer call correct af te handelen.
    corsHandler(req, res, async () => {
      // CORS pre-flight requests afhandelen
      if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Max-Age", "3600");
        res.status(204).send("");
        return;
      }

      // Controleer of het een POST-verzoek is (voor formulierinzendingen)
      if (req.method !== "POST") {
        return res
          .status(405)
          .json({ error: "Alleen POST-verzoeken zijn toegestaan." });
      }

      // Extract data from the request body.
      // Zorg ervoor dat je frontend de data als JSON verstuurt (Content-Type: application/json).
      // De namen 'naam', 'email', 'bericht' moeten overeenkomen met de formuliervelden.
      const { company, email, phone } = req.body;

      // Eenvoudige server-side validatie
      if (!company || !email || !phone) {
        return res
          .status(400)
          .json({ error: "Naam, e-mail en bericht zijn verplicht." });
      }
      if (
        typeof company !== "string" ||
        company.length < 2 ||
        company.length > 100
      ) {
        return res.status(400).json({ error: "Naam is ongeldig." });
      }
      if (
        typeof email !== "string" ||
        !email.includes("@") ||
        !email.includes(".")
      ) {
        return res.status(400).json({ error: "Ongeldig e-mailadres." });
      }

      try {
        // Haal de secrets op uit Secret Manager via process.env.
        // Deze zijn nu beschikbaar omdat ze gekoppeld zijn met .runWith().

        // Controleer of de secrets daadwerkelijk zijn geladen
        if (!mailEmailUser.value() || !mailPasswordUser.value()) {
          console.error(
            "ERROR: EMAIL_ADRES of EMAIL_WACHTWOORD secret niet gevonden. Controleer Secret Manager en .runWith() configuratie."
          );
          return res
            .status(500)
            .json({ error: "Serverfout: E-mail referenties ontbreken." });
        }

        // Initialiseer de Nodemailer transporter BINNEN de functie.
        // Zo zijn mailEmailUser en mailPasswordUser zeker beschikbaar.
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: mailEmailUser.value(), // Het e-mailadres dat de mail verstuurt
            pass: mailPasswordUser.value(), // Het app-wachtwoord voor dat e-mailadres
          },
        });

        // Configureer de mailopties
        const mailOptions = {
          from: `Contactformulier <${mailEmailUser.value()}>`, // De afzender die in de mail wordt getoond
          to: mailEmailUser.value(), // Het ontvangende e-mailadres (meestal je eigen admin-adres)
          // Als je de mail naar een ander adres wilt sturen, vervang dan mailEmailUser
          // door bijv. 'jouw.admin.adres@voorbeeld.com'
          subject: `Nieuw contactbericht van ${company}`, // Onderwerp met de naam van de inzender
          html: `
                        <h1>Nieuw Contactbericht</h1>
                        <p><strong>Company:</strong> ${company}</p>
                        <p><strong>E-mail:</strong> ${email}</p>
                        <p><strong>phone:</strong></p>
                        <p>${phone}</p>
                    `,
        };

        // Verstuur de e-mail
        await transporter.sendMail(mailOptions);
        console.log("E-mail succesvol verzonden!");
        return res
          .status(200)
          .json({ message: "Bericht succesvol verzonden!" });
      } catch (error) {
        console.error("Fout bij verzenden e-mail:", error);
        // Stuur een gedetailleerdere foutmelding terug (zonder gevoelige info)
        return res.status(500).json({
          error:
            "Er is een fout opgetreden bij het verzenden van het bericht. Probeer het later opnieuw.",
        });
      }
    });
  }
);
