import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/schemas/register";
import { userGetByEmail } from "@/data/user";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { success, data } = LoginSchema.safeParse(credentials);
        if (success) {
          const user = await userGetByEmail(data.email);
          if (!user || !user.password) return null;
          if (user.accountStatus == "SUSPENDED") return null;

          const passwordsMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
