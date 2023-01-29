import { body, validationResult } from "express-validator";
import express from "express";

import sendEmail from "./send-email";
import sendResponse from "./send-response";

const MAILER = express();
MAILER.use(express.json());

MAILER.get("/", async (req, res) => {
  sendResponse(res, 200, "mailer is available");
});

MAILER.post(
  "/",
  body("userEmail").isEmail(),
  body("pipsToken").notEmpty().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
    }
    if (!errors.isEmpty() || req.body.pipsToken !== process.env.PIPS_TOKEN) {
      sendResponse(res, 401, "invalid request");
      console.log(req.body, process.env.PIPS_TOKEN, errors);
      return;
    } else {
      sendEmail(
        req.body.userEmail,
        "validate your registration to yactouat.com",
        // TODO construct validation link
        "Hey 👋 and welcome to yactouat.com! Please click on the link below to validate your registration. Thanks for joining my PIPS! 🙏"
      );
      sendResponse(res, 200, "mailer has processed input");
    }
  }
);

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT as string) || 8080;
const server = MAILER.listen(PORT, HOST, () => {
  console.log("mailer service server running on port 8080");
});
