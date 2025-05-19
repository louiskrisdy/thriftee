import { redirect } from "next/navigation"
import SettingsCard from "./settings-card"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { account, user } from "@/server/schema"
import { db } from "@/server"
import { eq } from "drizzle-orm"


export default async function Settings() {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    if (!session) {
        redirect("/auth/login");
    }
    if (session) {
        const currUser = await db.query.user.findFirst({
            where: eq(user.id, session!.user.id),
        });
        if(currUser) {
            const socialLogon = await db.query.account.findFirst({
                where: eq(account.userId, currUser.id),
              });
              const isOAuthUser = socialLogon?.providerId === "google";
            //   console.log(socialLogon);
      
              return <SettingsCard sessionUser={{ ...currUser, isOAuth: isOAuthUser }} />;
        }
        else {
            console.log("Error getting current user");
        }
    }
    
}