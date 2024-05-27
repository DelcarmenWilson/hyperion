import { PhoneNumber, UserRole } from "@prisma/client";
import NextAuth,{type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled:boolean;
    isOAuth:boolean
    messageNotification:string
    dataStyle:string
    team:string
    phoneNumbers:PhoneNumber[]
    image:string
  };
  
  declare module "next-auth" {
    interface Session {
      user: ExtendedUser;
    }
  }