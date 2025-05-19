"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "./auth-card";
import { RegisterSchema } from "@/types/register-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) {
        router.push("/auth/email-verif-sent");
        // setSuccess(data.data.success);
        // Redirect to login page after successful registration (optional)
        // router.push("/auth/login");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log("before server action runs");
    execute(values);
  };

  // async function onSubmit(values: z.infer<typeof RegisterSchema>){
  //   console.log("before server action runs");
  //   const { name, email, password } = values;
  //   const { data, error } = await authClient.signUp.email({
  //     email,
  //     password,
  //     name,
  //     callbackURL: "/auth/login",
  //   }, {
  //     onRequest: () => {
  //       // toast({
  //       //   title: "Please wait"
  //       // })
  //     },
  //     onSuccess: () => {
  //       form.reset();
  //     },
  //     onError: (ctx) => {
  //       alert(ctx.error.message);
  //     }
  //   })
  // };

  return (
    <AuthCard
      cardTitle="Create an Account 🎉"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="thriftee123" type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormDescription />
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
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full mt-5",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
