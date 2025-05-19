"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  console.log(email + " EMAIL")
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ignadrianw@gmail.com",
    subject: "Thriftee - Confirmation Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</p>`,
  });

  if (error) return console.log(error);

  if (data) return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  console.log(email + "EMAIL");
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ignadrianw@gmail.com",
    subject: "Thriftee - Confirmation Email",
    html: `<p>Click here <a href='${confirmLink}'>reset your password</p>`,
  });

  if (error) return console.log(error);

  if (data) return data;
};


export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
    text,
  });

  if (error) console.error("Email error:", error);
  return data;
};

