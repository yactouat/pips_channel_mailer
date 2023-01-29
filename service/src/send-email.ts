import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, text: string) => {
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
  });
  transporter.sendMail(
    {
      from: process.env.PIPS_OWNER_EMAIL,
      to: "recipient@gmail.com",
      subject: "Message",
      text: "I hope this message gets delivered!",
    },
    (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
      console.error(err?.message);
    }
  );
};

const { argv } = require("process");
if (argv[1].endsWith("send-email.ts")) {
  // THIS IS A TEST
  sendEmail("", "", "");
}

export default sendEmail;
