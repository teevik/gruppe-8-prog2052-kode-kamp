import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";
import { SERVER_URL, VERIFY_ROUTE } from "../const";
import type { User } from "../../../shared/types";
import { getToken } from "../routers/auth";

const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const verifyEmailHTML = (jwtToken: string) =>
  `<a href="${
    SERVER_URL + VERIFY_ROUTE + jwtToken
  }">Click this link to verify your account at Kodekamp!✅</a>`;

export function sendVerifyEmail(recipient: User): Promise<void> {
  const jwtToken: string = getToken(recipient);

  const emailOptions: SendMailOptions = {
    from: `"Kodekamp" ${EMAIL_USER}`,
    to: recipient.email,
    subject: "Verify your account at Kodekamp!",
    html: verifyEmailHTML(jwtToken),
  };

  return transporter.sendMail(emailOptions);
}
