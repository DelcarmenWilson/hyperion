import { UserRole } from "@prisma/client";

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
