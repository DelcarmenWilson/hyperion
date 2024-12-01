import { db } from "@/lib/db";

export const userGetCurrent = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
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
        team: { select: {id:true, organization: { select: { id: true } } } },
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

export const userGetByEmailOrUsername = async (
  email: string,
  userName: string
) => {
  try {
    const user = await db.user.findFirst({
      where: { OR: [{ email }, { userName }] },
    });

    return user;
  } catch {
    return null;
  }
};

//TODO see if this can get replace with get user profile
// look for all the reference, change it to the new one then dont forget to delete this one

export const userGetByIdReport = async (id: string) => {

    return await db.user.findUnique({
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
