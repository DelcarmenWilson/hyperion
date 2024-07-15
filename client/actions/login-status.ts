"use server";
import { db } from "@/lib/db";

//DATA
export const loginStatusGetAll = async () => {
  try {
    const logins = await db.loginStatus.findMany();
    return logins;
  } catch (error) {
    return [];
  }
};

export const loginStatusGetAllByUserId = async (userId:string) => {
    try {
      const logins = await db.loginStatus.findMany({where:{userId}});
      return logins;
    } catch (error) {
      return [];
    }
  };

