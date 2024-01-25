import { PhoneNumber, UserRole } from "@prisma/client";
import NextAuth,{type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled:boolean;
    isOAuth:boolean
    phoneNumbers:PhoneNumber[]
  };
  
  declare module "next-auth" {
    interface Session {
      user: ExtendedUser;
    }
  }