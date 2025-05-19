"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/types/settings-schema"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { settings } from "@/server/actions/settings"
import { UploadButton } from "@/app/api/uploadthing/upload"
// import { Session } from "better-auth"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"


export default function SettingsCard({ sessionUser }: any) {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
//   console.log(sessionUser);
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: sessionUser.name || undefined,
      email: sessionUser.email || undefined,
      image: sessionUser.image || undefined,
      isTwoFactorEnabled: sessionUser.twoFactorEnabled || undefined,
    },
  });
  console.log(sessionUser.isOAuth)
  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setSuccess(data.data?.success);
        useRouter().refresh();
      }
      if (data.data?.error) {
        setError(data.data?.error);
      }
    },
    onError: (error) => {
      setError("Something went wrong")
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {

    setError(undefined)
    setSuccess(undefined)
  
    // If password is required for 2FA and not present
    if (
      values.isTwoFactorEnabled !== sessionUser.isTwoFactorEnabled &&
      !values.password
    ) {
      setError("Password is required to change two-factor authentication.")
      return
    }
  
    // Handle 2FA toggle first
    if (values.isTwoFactorEnabled !== sessionUser.isTwoFactorEnabled) {
      const password = values.password || ""
  
      const { error } = values.isTwoFactorEnabled
        ? await authClient.twoFactor.enable({ password })
        : await authClient.twoFactor.disable({ password })
  
      if (error) {
        setError(error.message || "Failed to update 2FA setting")
        return
      }
  
      setSuccess(
        `Two-factor authentication ${values.isTwoFactorEnabled ? "enabled" : "disabled"}`
      )
    }

    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {sessionUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image    
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="User Image"
                      />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true)
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        })
                        setAvatarUploading(false)
                        return
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!)
                        setAvatarUploading(false)
                        return
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div className="text-primary">Change Avatar</div>
                          return <div>Uploading...</div>
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="User Image"
                      type="hidden"
                      disabled={status === "executing"}
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
                        placeholder="********"
                        disabled={
                            status === "executing" || sessionUser.isOAuth
                        }
                        type={showPassword ? "text" : "password"}
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <div className="relative w-full">
                        <Input
                        {...field}
                        placeholder="********"
                        disabled={
                            status === "executing" || sessionUser.isOAuth
                        }
                        type={showNewPassword ? "text" : "password"}
                        />
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </div>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                  <Switch
                    disabled={status === "executing" || sessionUser.isOAuth}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                     </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}