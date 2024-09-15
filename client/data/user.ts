import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

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
        phoneSettings:true,
        displaySettings:true
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
export const userGetByAssistant = async (assitantId: string) => {
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

export const userGetByIdDefault = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

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

// USER LICENSES
export const userLicensesGetAllByUserId = async (
  userId: string,
  role: UserRole = "USER"
) => {
  try {
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const licenses = await db.userLicense.findMany({ where: { userId } });
    return licenses;
  } catch {
    return [];
  }
};




