import { db } from "@/lib/db";

export const phoneNumbersGetByAgentId = async (agentId: string) => {
  try {
    const phones = await db.phoneNumber.findMany({ where: { agentId } });

    return phones;
  } catch (error: any) {
    return [];
  }
};

export const phoneNumbersGetAll = async () => {
  try {
    const phones = await db.phoneNumber.findMany({
      include: { agent: { select: { firstName: true, lastName: true } } },
    });

    return phones;
  } catch (error: any) {
    return [];
  }
};
