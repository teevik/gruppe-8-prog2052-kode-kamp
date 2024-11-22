import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";
import { SERVER_URL } from "../const";
import type { User } from "../../../shared/types";
import { getEmailToken } from "../routers/auth";
import { EMAIL_USER, EMAIL_PASS } from "../env";
import { VERIFY_ROUTE } from "../../../shared/const";

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const verifyEmailHTML = (jwtToken: string, username: string) =>
  `<h1>Welcome, ${username}!</h1> <a href="${
    SERVER_URL + VERIFY_ROUTE
  }/${jwtToken}">Click this link to verify your account at Kodekamp!✅</a>`;

export function sendVerifyEmail(recipient: User): Promise<void> {
  const jwtToken: string = getEmailToken(recipient.id);

  const emailOptions: SendMailOptions = {
    from: `"Kodekamp" ${EMAIL_USER}`,
    to: recipient.email,
    subject: "Verify your account at Kodekamp!",
    html: verifyEmailHTML(jwtToken, recipient.username),
  };

  return transporter.sendMail(emailOptions);
}
