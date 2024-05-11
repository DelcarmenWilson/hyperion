import { db } from "@/lib/db";

export const phoneNumbersGetByAgentId = async (agentId: string) => {
  try {
    const phones = await db.phoneNumber.findMany({ where: { agentId } });

    return phones;
  } catch (error: any) {
    return [];
  }
};

export const phoneNumbersGetAssigned = async () => {
  try {
    const phones = await db.phoneNumber.findMany({
      where: {
        NOT: {
          agentId: null
        }
      },
      include: { agent: { select: { firstName: true, lastName: true } } },
    });

    return phones;
  } catch (error: any) {
    return [];
  }
};
export const phoneNumbersGetUnassigned = async () => {
  try {
    const phones = await db.phoneNumber.findMany({
      where:  {
          agentId: null
        }
      },
    );

    return phones;
  } catch (error: any) {
    return [];
  }
};