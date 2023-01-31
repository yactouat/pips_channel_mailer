import { body, validationResult } from "express-validator";
import crypto from "crypto";
import express from "express";
import {
  getPgClient,
  getUserFromDb,
  sendJsonResponse,
} from "pips_resources_definitions/dist/behaviors";
import { TokenResource } from "pips_resources_definitions/dist/resources";

import sendEmail from "./send-email";

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
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
    }
    if (!errors.isEmpty() || req.body.pipsToken !== process.env.PIPS_TOKEN) {
      sendJsonResponse(res, 401, "invalid request");
      return;
    }
    // creating a validation token
    const validationToken: TokenResource = {
      type: "User_Verification",
      token: crypto.randomBytes(32).toString("hex"),
    };
    try {
      // store validation token in database
      const pgClient1 = getPgClient();
      await pgClient1.connect();
      const insertToken = await pgClient1.query(
        "INSERT INTO tokens(token) VALUES ($1) RETURNING *",
        [validationToken.token]
      );
      await pgClient1.end();
      const token = insertToken.rows[0] as TokenResource;
      // get user linked to email
      const user = await getUserFromDb(req.body.userEmail, getPgClient());
      // store token association with user in database
      const pgClient2 = getPgClient();
      await pgClient2.connect();
      await pgClient2.query(
        "INSERT INTO tokens_users(token_id, user_id, type) VALUES ($1, $2, $3) RETURNING *",
        [token.id, user.id, validationToken.type.toLowerCase()]
      );
      await pgClient2.end();
      // send email to user with validation link containing validation token
      sendEmail(
        user.email,
        "validate your registration to yactouat.com",
        `<p>Hey 👋 and welcome to yactouat.com! Please click on <a href="${encodeURI(
          "https://www.yactouat.com/?vt=" +
            validationToken.token +
            "&e=" +
            user.email
        )}">this link</a> to validate your registration. Thanks for joining my PIPS! 🙏</p>`
      );
      sendJsonResponse(res, 200, "mailer has processed input");
    } catch (error) {
      sendJsonResponse(res, 500, "mailer has failed");
      // TODO better observability here
      console.error(error);
    }
  }
);

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT as string) || 8080;
const server = MAILER.listen(PORT, HOST, () => {
  console.log("mailer service server running on port 8080");
});
