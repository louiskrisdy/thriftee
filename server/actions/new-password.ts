'use server'

import { actionClient } from "@/lib/safe-action"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { getPasswordResetTokenByToken } from "./tokens"
import { db } from ".."
import { eq } from "drizzle-orm"
import { passwordResetTokens, user } from "../schema"
import bcrypt from "bcryptjs"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { authClient } from "@/lib/auth-client"

export const newPassword = actionClient
    .schema(NewPasswordSchema)
    .action(async ({ parsedInput: {password, token} }) => {
        // const pool = new Pool({connectionString: process.env.POSTGRES_URL});
        // const dbPool = drizzle(pool);
        // // TO CHECK THE TOKEN
        // if(!token){
        //     return { error: "Token is missing" }
        // }
        // // CHECK IF THE TOKEN IS VALID
        // const existingToken = await getPasswordResetTokenByToken(token);
        // if(!existingToken){
        //     return { error: "Token is not valid" }
        // }

        // const hasExpired = new Date(existingToken.expires) < new Date();
        // if(hasExpired){
        //     return { error: "Token has expired" }
        // }

        // const existingUser = await db.query.user.findFirst({
        //     where: eq(user.email, existingToken.email)
        // })
        // if(!existingUser){
        //     return { error: "User not found" }
        // }
        // const hashedPassword = await bcrypt.hash(password, 10)

        // await dbPool.transaction(async (tx)=> {
        //     await tx.update(user).set({
        //         password: hashedPassword
        //     })
        //     .where(eq(user.id, existingUser.id))

        //     await tx.delete(passwordResetTokens)
        //     .where(eq(passwordResetTokens.id, existingToken.id))
        // })
        
        
        const { error } = await authClient.resetPassword({
            newPassword: password,
        })
        if(error) {
            console.log(token);
            console.log(error);
            return { error: "ERRORRRR"}
        }
        return { success: "Password updated" }
    }
)