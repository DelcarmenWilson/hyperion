import {
  Appointment,
  Call,
  ChatSettings,
  Lead,
  LeadConversation,
  PhoneNumber,
  PhoneSettings,
  Prisma,
  Team,
  User,
  UserCarrier,
} from "@prisma/client";

import { LeadPolicyType } from "./lead";
import { FullTeam } from ".";
import { getUserProfile } from "@/actions/user/profile";

export type HalfUser = {
  id: string;
  userName: string;
};
export type ShortUser = User & {
  team?: Team | null;
};
export type OnlineUser = User & {
  chatId?: string;
  calls: number;
  duration: number;
  online: boolean;
  unread: number;
  lastMessage: string;
};

export type SummaryUser = User & {
  phoneNumbers: PhoneNumber[];
  chatSettings: ChatSettings;
  phoneSettings: PhoneSettings;
};

export type FullUser = User & {
  calls: Call[];
  leads: Lead[];
  appointments: Appointment[];
  conversations: LeadConversation[];
  team: Team;
};

export type FullUserReport = User & {
  phoneNumbers: PhoneNumber[];
  calls: Call[];
  leads: LeadPolicyType[];
  conversations: LeadConversation[];
  appointments: Appointment[];
  team?: FullTeam | null;
};

// export type UserProfile = User & {
//   phoneNumbers: PhoneNumber[];
//   team: {
//     name: string;
//     organization: {
//       id:string,
//       name: string;
//     };
//   }|null;
// };
export type UserProfile = Prisma.PromiseReturnType<
  typeof getUserProfile
>;


export type FullUserTeamReport = {
  id: string;
  image: string | null;
  userName: string;
  role: String;
  calls: number;
  appointments: number;
  conversations: number;
  revenue: number;
};

export type FullUserCarrier = UserCarrier & {
  carrier: { name: string };
};

export enum UserRoles {
  STUDENT = "Student",
  ASSISTANT = "Assistant",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
}


export enum UserAccountStatus{
  ACTIVE="Active",
  INACTIVE="Inactive",
  PRE_ACTIVE="Pre active",
 SUSPENDED="Suspended",
  }
