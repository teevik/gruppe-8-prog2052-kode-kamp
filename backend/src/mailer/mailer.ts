import type { SendMailOptions, Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import { VERIFY_ROUTE } from "../../../shared/const";
import type { UserJWT } from "../../../shared/types";
import { env } from "../env";
import { getEmailToken } from "../routers/auth";

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const verifyEmailHTML = (jwtToken: string, username: string) =>
  `<h1>Welcome, ${username}!</h1> <a href="${
    env.SERVER_URL + VERIFY_ROUTE
  }/${jwtToken}">Click this link to verify your account at Kodekamp!✅</a>  `;

/**
 * Function to send a verification email to a user that have registered an account
 *
 * @param recipient Information of the user that have just registered an account including the email
 * @returns Returns a promise to eventually handle any errors on the caller
 */
export function sendVerifyEmail(recipient: UserJWT): Promise<void> {
  const jwtToken: string = getEmailToken(recipient.id);

  const emailOptions: SendMailOptions = {
    from: `"Kodekamp" ${env.EMAIL_USER}`,
    to: recipient.email,
    subject: "Verify your account at Kodekamp!",
    html: verifyEmailHTML(jwtToken, recipient.username),
  };

  return transporter.sendMail(emailOptions);
}
