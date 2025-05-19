"use server";

import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { user } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./emails";
// import { signIn } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (!existingUser) {
        return { error: "Email not found" };
      }

      // Uncomment if you want to require verification
      // if (!existingUser.emailVerifiedDate) {
      //   const verificationToken = await generateEmailVerificationToken(email);
      //   await sendVerificationEmail(
      //     verificationToken[0].email,
      //     verificationToken[0].token
      //   );
      //   return { success: "Confirmation Email Sent" };
      // }

      // send the user otp
      const { data, error } = await authClient.twoFactor.sendOtp()
      if (data) {
          // redirect or show the user to enter the code
          alert("An OTP has been sent to your email. Please check your inbox and enter the code below.");

      } else {
        // Handle error sending OTP
        if (error) {
            alert("There was an issue sending the OTP. Please try again.");
        }
      }

      // verifying otp
      const verifyOtp = async (code: string) => {
        try {
            await authClient.twoFactor.verifyOtp({ code });
            
            // On success, you can redirect the user to their dashboard or another page
            alert("OTP verified successfully!");
            // window.location.href = "/dashboard/";
            
        } catch (error) {
            // On error, show an alert with the error message
            alert(error || "An error occurred during OTP verification. Please try again.");
        }
    };


      return { success: "Login successful!", redirectTo: "/" };
    } catch (err: any) {
      console.error("Login error:", err);
      return { error: err?.message || "Something went wrong" };
    }
  });
