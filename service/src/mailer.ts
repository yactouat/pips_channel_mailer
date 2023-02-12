import { body, validationResult } from "express-validator";
import crypto from "crypto";
import express from "express";
import {
  getPgClient,
  getUserFromDb,
  sendJsonResponse,
} from "pips_resources_definitions/dist/behaviors";

import sendEmail from "./send-email";
import saveUserVerifToken from "./insert-user-verification-token";

const MAILER = express();
MAILER.use(express.json());

MAILER.get("/", async (req, res) => {
  sendJsonResponse(res, 200, "mailer is available");
});

MAILER.post(
  "/",
  body("userEmail").isEmail(),
  body("pipsToken").notEmpty().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    // ! you need PIPS_OWNER_EMAIL and PIPS_TOKEN in your .env file or vars here
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
    }
    if (!errors.isEmpty() || req.body.pipsToken !== process.env.PIPS_TOKEN) {
      sendJsonResponse(res, 401, "invalid request");
      return;
    }
    // creating a validation token
    const user = await getUserFromDb(req.body.userEmail, getPgClient());
    if (!user) {
      sendJsonResponse(res, 404, "user not found");
      return;
    }
    const verifToken = crypto.randomBytes(32).toString("hex");
    const verifTokenProcess = await saveUserVerifToken(user.email, verifToken);
    if (!verifTokenProcess) {
      sendJsonResponse(res, 500, "mailer has failed");
      return;
    }
    // send email to user with validation link containing validation token
    sendEmail(
      user.email,
      "validate your registration to yactouat.com",
      `<p>Hey 👋 and welcome to yactouat.com! Please click on <a href="${encodeURI(
        "https://www.yactouat.com/profile?veriftoken=" +
          verifToken +
          "&email=" +
          user.email +
          "&userid=" +
          user.id
      )}">this link</a> to validate your registration.</p>
      <p>Validating your profile from your mailbox allows me to triage spammy bots 🤖 from valuable human beings like you ❤️.</p>
      <p>Thanks again for joining my PIPS! 🙏</p>`
    );
    sendJsonResponse(res, 200, "mailer has processed input");
  }
);

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT as string) || 8080;
const server = MAILER.listen(PORT, HOST, () => {
  console.log("mailer service server running on port 8080");
});
