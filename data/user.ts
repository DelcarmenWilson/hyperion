import { db } from "@/lib/db";

export const userGetById = async (id: string) => {
    try {
      const user = await db.user.findUnique({
        where: { id },
        include: { phoneNumbers: true, chatSettings: true, team: true },
      });
  
      return user;
    } catch {
      return null;
    }
  };

  export const userGetByEmail = async (email: string) => {
    try {
      const user = await db.user.findUnique({ where: { email } });
  
      return user;
    } catch {
      return null;
    }
  };