import express from "express";
import sendResponse from "./send-response";

const MAILER = express();
MAILER.use(express.json());

MAILER.get("/", async (req, res) => {
  sendResponse(res, 200, "mailer is available");
});

MAILER.post("/", async (req, res) => {
  console.log(req.body);
  sendResponse(res, 200, "mailer has processed input");
});

const HOST = "0.0.0.0";
const PORT = parseInt(process.env.PORT as string) || 8080;
const server = MAILER.listen(PORT, HOST, () => {
  console.log("mailer service server running on port 8080");
});
