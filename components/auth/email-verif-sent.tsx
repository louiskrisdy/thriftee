"use client"

import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import sending from '@/public/email-verif-sent.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


export const EmailVerifSent = () => {
    return (
      <div className="grow flex items-center justify-center p-4">
        <Card className="bg-secondary w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Lottie animationData={sending} className="w-40 h-40" loop={3} />
              <p className="text-center text-primary text-sm">
                <span className="font-bold">We've sent a verification link to your email address.</span>
                <br />
                <br />
                Please check your <a className="text-blue-700 underline" href="https://mail.google.com/" target="_blank">inbox</a> (and spam folder) and access the link to verify your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };