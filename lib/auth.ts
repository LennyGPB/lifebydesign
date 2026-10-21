import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const auth = betterAuth({
  appName: "Life By Design",
  baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === "production" ? siteConfig.url : {
    allowedHosts: ["localhost:3000", "localhost:3001", "localhost:3002", "127.0.0.1:3000", "127.0.0.1:3001", "127.0.0.1:3002"],
    protocol: "http",
  }),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  rateLimit: {
    enabled: true,
    customRules: {
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
});
