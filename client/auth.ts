import NextAuth from "next-auth";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";

import { PhoneNumber, UserRole } from "@prisma/client";

import { getAccountByUserId } from "@/data/account";
import { userGetById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { StringDecoder } from "string_decoder";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: { signIn: "/login", error: "/error" },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without enail verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await userGetById(user.id);

      //Prevent sign in witout email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;

        //Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;    
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.messageNotification=token.messageNotification as string
        session.user.dataStyle=token.dataStyle as string
        session.user.team=token.team as string
        session.user.phoneNumbers = token.phoneNumbers as PhoneNumber[];
        session.user.isOAuth=token.isOAuth as boolean
        session.user.image= token.picture as string
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await userGetById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.userName;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.messageNotification=existingUser.chatSettings?.messageNotification
      token.dataStyle=existingUser.chatSettings?.dataStyle
      token.team=existingUser.team?.id
      token.phoneNumbers=existingUser.phoneNumbers
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.picture=existingUser.image
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
