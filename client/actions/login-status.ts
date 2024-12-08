"use server";
import { db } from "@/lib/db";

//DATA
export const getLogins = async () => {
  return await db.loginStatus.findMany();
};

export const getLoginStatusForUser = async (userId: string) => {
  return await db.loginStatus.findMany({ where: { userId } });
};
