"use server";
import { AppInitailEmail } from "@/emails/app-remainder-email";
import ResetPasswordEmail from "@/emails/reset-password-email";
import TestEmail from "@/emails/test";
import { TodoReminderEmail } from "@/emails/todo-remainder-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "12125");

const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@hperioncrm.com",
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
    react: ResetPasswordEmail({ username, resetLink }),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@hperioncrm.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
  });
};

export const sendAppointmentInitialEmail = async (
  email: string,
  teamName = "Strongside",
  username: string,
  firstName: string,
  appId: string,
  dateTime: Date,
  cellPhone: string
) => {
  const rescheduleLink = `${domain}/book/${username}/${appId}`;
  const cancelLink = `${rescheduleLink}/cancel`;
  const newEmail = await resend.emails.send({
    from: `${username}@hperioncrm.com`,
    to: email,
    subject: "New Appointment",
    // html: `<p>Just a test</p>`,
    react: AppInitailEmail({
      teamName,
      firstName,
      dateTime,
      cellPhone,
      rescheduleLink,
      cancelLink,
    }),
  });
  return newEmail;
};

export const sendTodoReminderEmail = async ({
  email,
  todoId,
  title,
  description,
  username,
  comments,
  dueDate,
}: {
  email:string
  todoId: string;
  title: string;
  description: string;
  username: string;
  comments: string;
  dueDate: Date;
}) => {
  const todoLink = `${domain}/todos/${todoId}`;
  const todoCompleteLink = `${todoLink}/complete`;
  const newEmail = await resend.emails.send({
    from: "no-reply@hperioncrm.com",
    to: email,
    subject: "Task Reminder",
    react: TodoReminderEmail({
      title,
      description,
      comments,
      username,
      dueDate,
      todoLink,
      todoCompleteLink
    }),
  });
  return newEmail;
};

//TODO - this can be removed one the emails have been implemented
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
