"use server"

import { SettingsSchema } from "@/types/settings-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/lib/auth"
import { db } from ".."
import { eq } from "drizzle-orm"
import { user, account } from "../schema"
import { revalidatePath } from "next/cache"
import { actionClient } from "@/lib/safe-action"
import { headers } from "next/headers"
import { authClient } from "@/lib/auth-client"

const action = createSafeActionClient()

export const settings = actionClient
  .schema(SettingsSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const currUser = session?.user

    if (!currUser) {
      return { error: "User not found" }
    }

    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, currUser.id),
    })

    if (!dbUser) {
      return { error: "User not found" }
    }

    const socialLogon = await db.query.account.findFirst({
      where: eq(account.accountId, dbUser.id),
    })

    if (socialLogon?.providerId === "google") {
      parsedInput.password = undefined
      parsedInput.newPassword = undefined
      parsedInput.isTwoFactorEnabled = undefined
    }


    const authCtx = await auth.$context
    // console.log(parsedInput.password + " " + parsedInput.newPassword);


    if (parsedInput.password && parsedInput.newPassword) {
      const accountWithPassword = await db.query.account.findFirst({
        where: eq(account.userId, dbUser.id),
      })

      if (!accountWithPassword?.password) {
        return { error: "No password found for this user" }
      }

      // checking if user input the correct current password
      const isMatch = await authCtx.password.verify({
        password: parsedInput.password,
        hash: accountWithPassword.password,
      })
      console.log(isMatch);
      if (!isMatch) {
        return { error: "Current password does not match" }
      }

      const isSamePassword = await authCtx.password.verify({
        password: parsedInput.newPassword,
        hash: accountWithPassword.password,
      })

      if (isSamePassword) {
        return { error: "New password is the same as the old password" }
      }

      const hashedPassword = await authCtx.password.hash(parsedInput.newPassword);
      console.log(hashedPassword);

    //   await authClient.changePassword({
    //     newPassword: parsedInput.newPassword,
    //     currentPassword: parsedInput.password,
    //     revokeOtherSessions: true,
    //   });
      
        console.log(parsedInput.password + " " + parsedInput.newPassword);
        // const { error } = await authClient.changePassword({
        //     newPassword: parsedInput.newPassword,
        //     currentPassword: parsedInput.password,
        //     revokeOtherSessions: true,
        // });
        // if(error) {
        //     console.log(error);
        //     return { error: "ERRORRRR"}
        // }
        try {
            const passwordUpdate = await db
              .update(account)
              .set({ password: hashedPassword })
              .where(eq(account.userId, dbUser.id))
    
            if (!passwordUpdate) {
              return { error: "Failed to update password" }
            }
        } catch (err) {
            console.error("Password update error:", err)
            return { error: "Failed to update password" }
        }
    }

    const updatedUser = await db
    .update(user)
    .set({
      name: parsedInput.name,
      email: parsedInput.email,
      image: parsedInput.image,
    })
    .where(eq(user.id, dbUser.id));

    revalidatePath("/dashboard/settings")
    return { success: "Settings updated" }
  })
