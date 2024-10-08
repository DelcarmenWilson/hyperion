import { PhoneNumber, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  messageNotification: string;
  messageInternalNotification: string;
  dataStyle: string;
  organization: string;
  team: string;
  phoneNumbers: PhoneNumber[];
  image: string;
  masterSwitch: string;
  personalNumber: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
