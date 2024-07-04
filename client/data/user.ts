import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const usersGetAll = async () => {
  try {
    const users = await db.user.findMany({ orderBy: { firstName: "asc" } });

    return users;
  } catch {
    return [];
  }
};

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
        chatSettings: true,
        team: true,
        notificationSettings: true,
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

export const userGetByUserName = async (userName: string) => {
  try {
    const user = await db.user.findUnique({
      where: { userName },
      include: { phoneNumbers: true, chatSettings: true, team: true },
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

// USER CARRIERS
export const userCarriersGetAllByUserId = async (
  userId: string,
  role: UserRole = "USER"
) => {
  try {
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const carriers = await db.userCarrier.findMany({
      where: { userId },
      include: { carrier: { select: { name: true } } },
    });

    return carriers;
  } catch {
    return [];
  }
};

// USER TEMPLATES
export const userTemplatesGetAllByUserId = async (userId: string) => {
  try {
    const templates = await db.userTemplate.findMany({
      where: { userId },
    });

    return templates;
  } catch {
    return [];
  }
};
