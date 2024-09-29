import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const userGetCurrent = async (id: string) => {
  try {
    const ct = await db.user.findUnique({
      where: { id },
    });

    return ct;
  } catch {
    return null;
  }
};

export const userGetById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        phoneNumbers: true,
        team: true,
        notificationSettings: true,
        phoneSettings: true,
        displaySettings: true,
      },
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

export const userGetByIdReport = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        phoneNumbers: true,
        calls: true,
        leads: { include: { policy: true } },
        licenses: true,
        appointments: true,
        conversations: true,
        team: { include: { organization: true, owner: true } },
      },
    });

    return user;
  } catch {
    return null;
  }
};
//TODO - see if this can be removed, some files are still using this
export const userGetByAssistantOld = async (assitantId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { assitantId },
    });
    if (!user) return null;
    return user.id;
  } catch {
    return null;
  }
};
