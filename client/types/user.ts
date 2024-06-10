import {
    Conversation,
    User,
    Lead,
    Call,
    Appointment,
    Team,
    PhoneNumber,
    UserCarrier,
  } from "@prisma/client";

  import {  LeadPolicyType } from "./lead";
import { FullTeam } from ".";
  
export type HalfUser = {
    id: string;
    userName: string;
  };
  export type ShortUser = User & {
    team?: Team|null;
  };
  
  export type FullUser = User & {
    calls: Call[];
    leads: Lead[];
    appointments: Appointment[];
    conversations: Conversation[];
    team: Team;
  };
  
  export type FullUserReport = User & {
    phoneNumbers: PhoneNumber[];
    calls: Call[];
    leads: LeadPolicyType[];
    conversations: Conversation[];
    appointments: Appointment[];
    team?: FullTeam | null;
  };
  
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