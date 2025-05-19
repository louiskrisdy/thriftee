"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "./auth-card";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { generateEmailVerificationToken } from "@/server/actions/tokens";
import { EyeOffIcon, EyeIcon } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState<"idle" | "executing" | "success" | "error">("idle");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    setStatus("executing");
    setError("");
    setSuccess("");

    try {
      const { email, password } = values;

      const { data, error } = await authClient.signIn.email(
        { email, password },
        {
          async onSuccess(context) {
            // const user = context.data?.user;
            // if (user && !user.emailVerified) {

            //   const tokenRes = await generateEmailVerificationToken(user.email);
            //   await authClient.sendVerificationEmail({ 
            //     email: user.email,
            //     callbackURL: "/auth/verify-email"
            //   });
  
            //   // setSuccess("Email not verified. A verification link has been sent.");
            //   setStatus("idle");
            //   return;
            // }
            if (context.data.twoFactorRedirect) {
              setShowTwoFactor(true);

              const { error } = await authClient.twoFactor.sendOtp();
              if (error) {
                setError("Failed to send OTP. Please try again.");
                setStatus("error");
              } else {
                setSuccess("OTP sent to your email.");
                setStatus("idle");
              }
            } else {
              setSuccess("Login successful!");
              form.reset();
              setStatus("success");
              router.push("/");
              router.refresh();
            }
          },
        }
      );
      
      if (error) {
        if(error.message === "Email not verified") {
          router.push("/auth/email-verif-sent");
          // await authClient.sendVerificationEmail({ 
          //   email: email,
          //   callbackURL: "/auth/verify-email"
          // });
          // setSuccess("Email not verified. A verification link has been sent.");
          setStatus("idle");
          return;
        } else {
          setError(error.message || "Login failed.");
        }
        setStatus("error");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      console.log("Awww");
      setStatus("error");
    }
  };

  const handleVerifyOtp = async () => {
    setStatus("executing");
    setError("");
    setSuccess("");

    const code = form.getValues("code");

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code.");
      setStatus("idle");
      return;
    }

    try {
      const { error } = await authClient.twoFactor.verifyOtp({ code });

      if (error) {
        setError("Invalid or expired OTP. Please try again.");
        setStatus("error");
        return;
      }

      setSuccess("Login successful!");
      form.reset();
      setStatus("success");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  return (
    <AuthCard
      cardTitle="Welcome!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(showTwoFactor ? handleVerifyOtp : handleLogin)}>
          <div className="space-y-4">
            {showTwoFactor ? (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter 6-digit code sent to your email</FormLabel>
                    <FormControl>
                      <InputOTP {...field} maxLength={6} disabled={status === "executing"}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="thriftee@email.com"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative w-full">
                                <Input
                                    {...field}
                                    className="pr-5"
                                    placeholder="*********"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                />
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
              </>
            )}

            <FormSuccess message={success} />
            <FormError message={error} />

            {!showTwoFactor && (
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password?</Link>
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className={cn("w-full mt-6", status === "executing" ? "animate-pulse" : "")}
          >
            {showTwoFactor ? "Verify OTP" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
