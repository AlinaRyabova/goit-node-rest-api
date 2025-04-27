import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//   to: "xefide8437@cxnlab.com",
//   subject: "Hello",
//   html: "<h1>Hello! Test</h1>",
// };

// transport
//   .sendMail({ ...data, from: `Alina Riabova <${UKR_NET_EMAIL}>` })
//   .then(() => console.log("Email sent successfully"))
//   .catch((error) => console.log("Error sending email:", error.message));

export const sendEmail = (data) => {
  const email = { ...data, from: `Alina Riabova <${UKR_NET_EMAIL}>` };
  return transport.sendMail(email);
};
