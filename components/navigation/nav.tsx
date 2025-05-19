import Link from "next/link";
import { UserButton } from "./user-button";
// import { useSession } from "@/lib/auth-client";
import Logo from "@/components/navigation/logo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";
import { db } from "@/server";
import { user } from "@/server/schema";
import { eq } from "drizzle-orm";

export default async function Nav() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  let userRole = 'user';
    
  if(session?.user.email){
      const existingUser = await db.query.user.findFirst({
          where: eq(user.email, session?.user.email),
      });

      userRole = existingUser?.role ?? 'user';
  }

  // if(!session) {
  //   return redirect('/auth/login');
  // }
  // console.log(session?.user);

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href={"/"} aria-label="Thriftee Logo"><Logo/></Link>
          </li>
          <li className="relative flex items-center">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton user={session?.user} role={userRole} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}