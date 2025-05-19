import { z } from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      // If newPassword is provided, password must also be provided
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      // Require newPassword only if password is provided AND 2FA is not the only change
      const isChangingPassword = data.password && data.newPassword;
      const isOnlyToggling2FA = data.isTwoFactorEnabled !== undefined && !data.newPassword;

      // If password is provided, but newPassword is missing, and it's not a 2FA toggle => invalid
      if (data.password && !data.newPassword && !isOnlyToggling2FA) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required when changing password",
      path: ["newPassword"],
    }
  );
