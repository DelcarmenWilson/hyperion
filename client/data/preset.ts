import { db } from "@/lib/db";

export const presetsGetAllByAgentId = async (agentId: string) => {
  try {
    const presets = await db.presets.findMany({
      where: { agentId },
    });

    return presets;
  } catch (error: any) {
    return [];
  }
};