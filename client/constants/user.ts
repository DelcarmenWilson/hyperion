import { UserRole } from "@prisma/client";

type GeneralType = {
  name: string;
  value: string;
};

export const USERROLES: GeneralType[] = [
  {
    name: "Student",
    value: "STUDENT",
  },
  {
    name: "Assistant",
    value: "ASSISTANT",
  },
  {
    name: "User",
    value: "USER",
  },
  {
    name: "Admin",
    value: "ADMIN",
  },
  {
    name: "Super Admin",
    value: "SUPER_ADMIN",
  },
];

export const USERACCOUNTSTATUS: GeneralType[] = [
  {
    name: "active",
    value: "ACTIVE",
  },
  {
    name: "inactive",
    value: "INACTIVE",
  },
  {
    name: "pre active",
    value: "PRE_ACTIVE",
  },
  {
    name: "suspended",
    value: "SUSPENDED",
  },
];

export const UPPERADMINS: UserRole[] = ["MASTER", "DEVELOPER"];
export const HIGHERADMINS: UserRole[] = ["MASTER", "DEVELOPER", "SUPER_ADMIN"];
export const ALLADMINS: UserRole[] = [
  "MASTER",
  "ADMIN",
  "DEVELOPER",
  "SUPER_ADMIN",
];
export const DEVADMINS: UserRole[] = ["ADMIN", "DEVELOPER", "SUPER_ADMIN"];

export const ALLUSERS: UserRole[] = [
  "MASTER",
  "DEVELOPER",
  "ADMIN",
  "SUPER_ADMIN",
  "ASSISTANT",
  "USER",
];
export const ALLAGENTS: UserRole[] = [
  "SUPER_ADMIN",
  "DEVELOPER",
  "ADMIN",
  "USER",
];
