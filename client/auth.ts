import NextAuth from "next-auth";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";

import { PhoneNumber, UserRole } from "@prisma/client";

import { getAccountByUserId } from "@/data/account";
import { userGetById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

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
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await userGetById(user.id);

      //Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;
      
      //Prevent sign in without if account status is suspended
      if (existingUser?.accountStatus=="SUSPENDED") return false;

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
        session.user.messageNotification = token.messageNotification as string;
        session.user.messageInternalNotification =
          token.messageInternalNotification as string;
        session.user.dataStyle = token.dataStyle as string;
        session.user.organization = token.organization as string;
        session.user.team = token.team as string;
        session.user.phoneNumbers = token.phoneNumbers as PhoneNumber[];
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.picture as string;
        session.user.masterSwitch = token.masterSwitch as string;
        session.user.personalNumber = token.personalNumber as string;
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
      token.messageNotification =
        existingUser.phoneSettings?.messageNotification;
      token.messageInternalNotification =
        existingUser.phoneSettings?.messageInternalNotification;
      token.dataStyle = existingUser.displaySettings?.dataStyle;
      token.organization = existingUser.team?.organization.id;
      token.team = existingUser.team?.id;
      token.phoneNumbers = existingUser.phoneNumbers;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.picture = existingUser.image;
      token.masterSwitch = existingUser.notificationSettings?.masterSwitch;
      token.personalNumber = existingUser.phoneSettings?.personalNumber;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
