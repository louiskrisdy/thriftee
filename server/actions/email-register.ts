"use server";

import { RegisterSchema } from "@/types/register-schema";
import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcryptjs";
import { db } from "..";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { user } from "../schema";
import { sendVerificationEmail } from "./emails";
import { authClient } from "@/lib/auth-client";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    //hashing password
    // const hashedPassword = await bcrypt.hash(password, 10);
    //cek user yang udah ada
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    // cek kalo email udah di db: 'it's in use', kalo ngga register user, tapi send verif dulu
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
       
        await sendVerificationEmail(
          verificationToken[0].email!,
          verificationToken[0].token!,
        );
        
        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }
    //return { success: "done" };

    //logic buat user yang gak registered
    const { error } = await authClient.signUp.email({
      email,
      name,
      password,
      // callbackURL: "/auth/login"
    });


    if (error) {
      return { error: error.message || "Registration failed at auth layer" };
    }



    const verificationToken = await generateEmailVerificationToken(email);

    // await sendVerificationEmail(
    //   verificationToken[0].email!,
    //   verificationToken[0].token!,
    // );

    // await authClient.sendVerificationEmail({ 
    //   email: email,
    //   callbackURL: "/auth/verify-email"
    // });

    return { success: "Verification email sent! Please verify your account." };
  });
