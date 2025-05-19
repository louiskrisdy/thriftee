"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import dynamic from "next/dynamic";
import emailVerified from "@/public/email-verified.json"

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export const VerifyEmail = () => {
 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
//   const token = searchParams.get("token");
  const tokenError = searchParams.get("error");

  if (tokenError === "invalid_token" || error === "The reset link is invalid or has expired." || tokenError === "token_expired") {
    return (
      <div className="grow flex items-center justify-center p-4">
        <Card className="bg-primary w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Invalid Verification Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                This verification link is invalid or has expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  else {

  return <AuthCard backButtonLabel="Back to Login" backButtonHref="/auth/login" cardTitle="Verify your account.">
    <div className="flex flex-col items-center flex-col w-full justify-center">
        {/* <p>{!success && !error ? 'Verifying email...' : null}</p> */}
        <Lottie animationData={emailVerified} />
        <FormSuccess message="Email Verified"/>
        {/* <FormError message={error}/> */}
    </div>
  </AuthCard>
  }

};
