"use server";
import ResetPasswordEmail from "@/emails/reset-password-email";
import TestEmail from "@/emails/test";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "12125");

const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code your password",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (
  username: string,
  email: string,
  token: string
) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  await resend.emails.send({
    from: "no-reply@hperioncrm.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    react:ResetPasswordEmail({username,resetLink})
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
  });
};

export const sendTestEmail = async (email: string, username: string) => {
  const newEmail = await resend.emails.send({
    from: "wdelcarmen@hperioncrm.com",
    to: email,
    subject: "Test Email",
    // html: `<p>Just a test</p>`,
    react: TestEmail({ username }),
  });
  return newEmail;
};
