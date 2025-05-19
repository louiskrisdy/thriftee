"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { passwordResetTokens, user, verification } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verification.findFirst({
      where: eq(verification.token, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(verification).where(eq(verification.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(verification)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return verificationToken;
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);
  if (!existingToken) return { error: "Token not found" };
  const hasExpired = new Date(existingToken.expires!) < new Date();

  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, existingToken.email!),
  });
  if (!existingUser) return { error: "Email does not exist" };
  await db
    .update(user)
    .set({
      emailVerified: true,
      emailVerifiedDate: new Date(),
    })
    .where(eq(user.email, existingToken.email!));

  await db.delete(verification).where(eq(verification.id, existingToken.id));
  return { success: "Email Verified" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
    try{
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token),
        })

        if (!passwordResetToken) {
            return null;
        }

        return passwordResetToken
    }catch(error){
        return null;
    }
}

export const getPasswordResetTokenByEmail =  async (email: string) => {
  try{
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.email, email),
    })

    return passwordResetToken;

}catch(error){
    return null;
}
}

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Remove old token if it exists
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    }

    const [newToken] = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return newToken ?? null;
  } catch (error) {
    console.error("Error generating password reset token:", error);
    return null;
  }
}
