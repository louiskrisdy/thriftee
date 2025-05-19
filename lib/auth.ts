import {db} from '@/server'
import { sendEmail, sendPasswordResetEmail } from '@/server/actions/emails';
import {betterAuth, BetterAuthOptions} from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
// import { text } from 'stream/consumers';
import { twoFactor } from 'better-auth/plugins'
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';


const stripeClient = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2025-04-30.basil",
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {

  },
  plugins:[
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ customer, stripeCustomer, user }, request) => {
        console.log(`Customer ${customer.id} created for user ${user.id}`);
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          // send otp to user
          if(!user.email) {
            throw new Error("User does not have a valid email address");
          }
          const subject = "Thriftee - Your OTP Code";
          const body = `Hi ${user.name || "user"},\n\nYour login code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn’t request this, you can ignore this email.`;
          const htmlBody = `
          <p>Hi ${user.name || "user"},</p>
          <p>Your login code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
        `;
          await sendEmail({
            to: user.email,
            subject: subject,
            text: body,
            html: htmlBody,
          });

        },
      },
      skipVerificationOnEnable: true
    })
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID! as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
      redirectURI: process.env.BASE_URL + "/api/auth/callback/github",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
      redirectURI: process.env.BASE_URL + "/api/auth/callback/google",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  // user: {
  //   additionalFields: {
  //     premium: {
  //       type: "boolean",
  //       required: false,
  //     },
  //   },
  // },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Thriftee - Password Reset",
        text: `Click here to reset your password: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      const callbackUrl = "/auth/verify-email";

      const modifiedUrl = new URL(url);
      modifiedUrl.searchParams.set("callbackURL", callbackUrl);
      await sendEmail({
        to: user.email,
        // to: "valorantdx3@gmail.com",
        subject: "Thriftee - Email Verification",
        text: `Click the link to verify your email: ${modifiedUrl.toString()}`,
        html: `<p>Click <a href="${modifiedUrl.toString()}">here</a> to verify your email.</p>`,
      });
    },
  },
} satisfies BetterAuthOptions );