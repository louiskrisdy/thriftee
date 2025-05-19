'use server';

import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { user } from "../schema";
import { ResetSchema } from "@/types/reset-schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./emails";
import { authClient } from "@/lib/auth-client";

// const actionClient = createSafeActionClient();

export const reset = actionClient.schema(ResetSchema).action(async ({ parsedInput }) => {
    const { email } = parsedInput;
  
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
  
    if (!existingUser) {
      return { error: "User not found!" };
    }
  
    // const tokenRecord = await generatePasswordResetToken(email);
  
    // if (!tokenRecord || !tokenRecord.token) {
    //   return { error: "Token not generated" };
    // }
  
    const { error } = await authClient.forgetPassword({
        email: email,
        redirectTo: "/auth/new-password",
    });

    if(error) {
        return { error: "ERROR HERE" }
    }
    // await sendPasswordResetEmail(tokenRecord.email, tokenRecord.token);
  
    return { success: "Reset Email Sent" };
  });
  
