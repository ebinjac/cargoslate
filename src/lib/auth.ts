import { betterAuth } from 'better-auth';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { organization } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import * as schema from '../db/schema';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
       ...schema
    }
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[VERIFICATION EMAIL TRIGGERED] Sending to: ${user.email}, URL: ${url}`);
      
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.error('🚨 [CRITICAL ERROR] RESEND_API_KEY is undefined! You MUST restart your "npm run dev" server for the new .env.local variables to take effect.');
        return;
      }

      // We do not await this to prevent timing attacks, as recommended by Better Auth docs
      void (async () => {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(apiKey);
          
          console.log(`[RESEND] Attempting to dispatch email via Resend to ${user.email}...`);
          const result = await resend.emails.send({
            from: 'CargoSlate <onboarding@resend.dev>',
            to: user.email,
            subject: 'Verify your email address for CargoSlate',
            html: `<p>Please verify your email address by clicking <a href="${url}">this link</a>.</p>`,
          });

          if (result.error) {
            console.error('❌ [RESEND API ERROR]', result.error);
          } else {
            console.log('✅ [RESEND SUCCESS] Email dispatched successfully! ID:', result.data?.id);
          }
        } catch (err) {
          console.error('❌ [RESEND EXCEPTION]', err);
        }
      })();
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    } : {}),
  },
  plugins: [
    tanstackStartCookies(),
    organization({
      organization: {
        schema: {
          logoUrl: { type: "string", required: false },
          brandSettings: { type: "string", required: false }, 
          polarCustomerId: { type: "string", required: false },
          subscriptionTier: { type: "string", required: false }, 
          subscriptionStatus: { type: "string", required: false },
        }
      }
    }),
  ],
});
