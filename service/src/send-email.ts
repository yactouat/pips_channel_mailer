import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(
    "sending email to " + to + " FROM " + process.env.PIPS_OWNER_EMAIL
  );
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
  });
  transporter.sendMail(
    {
      from: process.env.PIPS_OWNER_EMAIL,
      to: to,
      subject: subject,
      text: text,
    },
    (err, info) => {
      console.log("SENDMAIL SUCCESS", info?.response);
      console.error("SENDMAIL ERROR", err?.message);
    }
  );
};

const { argv } = require("process");
if (argv[1].endsWith("send-email.ts")) {
  // THIS IS A TEST
  sendEmail("", "", "");
}

export default sendEmail;
