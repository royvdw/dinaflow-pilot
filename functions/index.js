// IMPORTEER SPECIFIEKE FUNCTIES VAN FIREBASE-ADMIN
import { initializeApp } from "firebase-admin/app";

// IMPORTEER ANDERE AFHANKELIJKHEDEN
import * as functions from "firebase-functions";
import cors from "cors";
import * as nodemailer from "nodemailer";

// INITIALISEER DE FIREBASE ADMIN SDK
initializeApp();

/* gmail credentials */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bigbangdesigns@gmail.com",
    pass: "bgca cktj euxv ozud",
  },
});

const corsHandler = cors({
  origin: true,
});

export const sendMailOverHTTP = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const mailOptions = {
      from: "noreply@dinaflow.com",
      to: "mrroywesten@hotmail.com",
      subject: "Reply on the contactform",
      html: `<h1>Pilot Form Message</h1>
             <p>
               <b>Email: </b>${req.body.email}<br>
               <b>Name: </b>${req.body.name}<br>
               <b>Telephone: </b>${req.body.telephone}<br>
               <b>Message: </b>${req.body.message}<br>
             </p>`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        return res.send(error.toString());
      }

      return res.send(data);
    });
  });
});
