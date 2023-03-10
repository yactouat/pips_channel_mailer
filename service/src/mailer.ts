import { body, validationResult } from "express-validator";
import express from "express";
import {
  getUserFromDbWithEmail,
  linkTokenToUserMod,
  saveUserToken,
  sendJsonResponse,
} from "pips_resources_definitions/dist/behaviors";

import sendEmail from "./send-email";
import validateUserTokenType from "./validate-user-token-type";

const mailerHasFailedMsg = "mailer has failed";

const MAILER = express();
MAILER.use(express.json());

MAILER.get("/", async (req, res) => {
  sendJsonResponse(res, 200, "mailer is available");
});

MAILER.post(
  "/mail-owner",
  body("pipsToken").notEmpty().isString(),
  body("userEmail").isEmail(),
  body("userTokenType").custom((value) => {
    return validateUserTokenType(value);
  }),
  async (req, res) => {
    const errors = validationResult(req);
    // ! you need PIPS_OWNER_EMAIL and PIPS_TOKEN in your .env file or vars here
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
    }
    if (!errors.isEmpty() || req.body.pipsToken !== process.env.PIPS_TOKEN) {
      console.log("unauthorized request: ", req.body);
      console.info("actual mailer PIPS token: ", process.env.PIPS_TOKEN);
      sendJsonResponse(res, 401, "unauthorized request");
      return;
    }

    // constructing email
    let emailSubject = "";
    let emailText = "";
    let tokenTypeSupported = true;
    switch (req.body.userTokenType) {
      case "User_Verification":
        emailSubject = "a new user signed up to yactouat.com !";
        emailText = `<p>Hey me 👋 you have a new yactouat.com user ! his email is ${req.body.userEmail}, kinda cool uh ?</p>
        <p>Long live my Portable Integrated Personal System ! 💪</p>`;
        break;
      default: // means the token type is not supported
        console.error("token type not supported: ", req.body.userTokenType);
        sendJsonResponse(res, 500, mailerHasFailedMsg);
        tokenTypeSupported = false;
        break;
    }

    // sending email
    if (tokenTypeSupported == true) {
      // send email to user with link containing token to validate any action
      sendEmail(
        process.env.PIPS_OWNER_EMAIL as string,
        emailSubject,
        emailText
      );
      sendJsonResponse(res, 200, "mailer has processed input");
    }
  }
);

MAILER.post(
  "/mail-user",
  body("pipsToken").notEmpty().isString(),
  body("userEmail").isEmail(),
  body("userModId").isInt().optional(),
  body("userTokenType").custom((value) => {
    return validateUserTokenType(value);
  }),
  async (req, res) => {
    const errors = validationResult(req);
    // ! you need PIPS_OWNER_EMAIL and PIPS_TOKEN in your .env file or vars here
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
    }
    if (!errors.isEmpty() || req.body.pipsToken !== process.env.PIPS_TOKEN) {
      console.log("unauthorized request: ", req.body);
      console.info("actual mailer PIPS token: ", process.env.PIPS_TOKEN);
      sendJsonResponse(res, 401, "unauthorized request");
      return;
    }

    // creating a token of allowed type
    const user = await getUserFromDbWithEmail(req.body.userEmail);
    if (!user) {
      sendJsonResponse(res, 404, "user not found");
      return;
    }
    const newToken = await saveUserToken(user.email, req.body.userTokenType);
    if (newToken == "") {
      console.error("user token creation failed with params: ", req.body);
      sendJsonResponse(res, 500, mailerHasFailedMsg);
      return;
    }

    if (req.body.userTokenType === "User_Modification") {
      try {
        await linkTokenToUserMod(newToken, parseInt(req.body.userModId));
      } catch (error) {
        console.error(
          "token linkeage to user mod failed with params: ",
          req.body,
          " and token: ",
          newToken
        );
        sendJsonResponse(res, 500, mailerHasFailedMsg);
        return;
      }
    }

    // constructing email
    let emailSubject = "";
    let emailText = "";
    let tokenTypeSupported = true;
    switch (req.body.userTokenType) {
      case "User_Deletion":
        emailSubject = "request to delete your yactouat.com profile";
        emailText = `<p>Hey 👋 from yactouat.com</p>
        <p>A request has been made to delete your personal data ! If this request originates from you, please click on <a href="${encodeURI(
          "https://www.yactouat.com/profile?deletetoken=" +
            newToken +
            "&email=" +
            user.email +
            "&userid=" +
            user.id
        )}">this link</a> to validate your profile deletion.</p>
        <p>If this request does not come from you, you can discard it entirely or send an email to ${
          process.env.PIPS_OWNER_EMAIL
        } so we look into it.</p>
        <p>Thanks again for your interest for my Portable Integrated Personal System ! 🙏</p>`;
        break;
      case "User_Modification":
        emailSubject = "request to modify your yactouat.com profile";
        emailText = `<p>Hey 👋 from yactouat.com</p>
        <p>A request has been made to modify your personal data ! If this request originates from you, please click on <a href="${encodeURI(
          "https://www.yactouat.com/profile?modifytoken=" +
            newToken +
            "&email=" +
            user.email +
            "&userid=" +
            user.id
        )}">this link</a> to validate this modification.</p>
        <p>If this request does not come from you, you can discard it entirely or send an email to ${
          process.env.PIPS_OWNER_EMAIL
        } so we look into it.</p>
        <p>Thanks again for being a member of my Portable Integrated Personal System ! 🙏</p>`;
        break;
      case "User_Verification":
        emailSubject = "validate your registration to yactouat.com";
        emailText = `<p>Hey 👋 and welcome to yactouat.com! Please click on <a href="${encodeURI(
          "https://www.yactouat.com/profile?veriftoken=" +
            newToken +
            "&email=" +
            user.email +
            "&userid=" +
            user.id
        )}">this link</a> to validate your registration.</p>
        <p>Validating your profile from your mailbox allows me to triage spammy bots 🤖 from valuable human beings like you ❤️.</p>
        <p>Thanks again for joining my Portable Integrated Personal System ! 🙏</p>`;
        break;
      default: // means the token type is not supported
        console.error("token type not supported: ", req.body.userTokenType);
        sendJsonResponse(res, 500, mailerHasFailedMsg);
        tokenTypeSupported = false;
        break;
    }

    // sending email
    if (tokenTypeSupported == true) {
      // send email to user with link containing token to validate any action
      sendEmail(user.email, emailSubject, emailText);
      sendJsonResponse(res, 200, "mailer has processed input");
    }
  }
);

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT as string) || 8080;
const server = MAILER.listen(PORT, HOST, () => {
  console.log("mailer service server running on port 8080");
});
