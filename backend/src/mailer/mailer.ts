import type { SendMailOptions, Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import { VERIFY_ROUTE } from "../../../shared/const";
import type { UserJWT } from "../../../shared/types";
import { SERVER_URL } from "../const";
import { EMAIL_PASS, EMAIL_USER } from "../env";
import { getEmailToken } from "../routers/auth";

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

export function sendVerifyEmail(recipient: UserJWT): Promise<void> {
  const jwtToken: string = getEmailToken(recipient.id);

  const emailOptions: SendMailOptions = {
    from: `"Kodekamp" ${EMAIL_USER}`,
    to: recipient.email,
    subject: "Verify your account at Kodekamp!",
    html: verifyEmailHTML(jwtToken, recipient.username),
  };

  return transporter.sendMail(emailOptions);
}
