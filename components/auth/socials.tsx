"use client";

import { Button } from "@/components/ui/button";
import { authClient, signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ErrorContext } from "better-auth/react";

export default function Socials() {

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google"
      },
      {
        onRequest: () => {

        },
        onSuccess: () => {

        },
        onError: (ctx: ErrorContext) => {
					console.log(ctx.error.message ?? "Something went wrong.");
				},
      }
    )
  }

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github"
      },
      {
        onRequest: () => {

        },
        onSuccess: () => {

        },
        onError: (ctx: ErrorContext) => {
					console.log(ctx.error.message ?? "Something went wrong.");
				},
      }
    )
  }

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={handleSignInWithGoogle}
      >
        <p>Sign in with Google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      {/* <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={handleSignInWithGithub}
      >
        <p>Sign in with Github</p>
        <FaGithub className="w-5 h-5" />
      </Button> */}
    </div>
  );
}
