import { db } from "@/lib/db";

export const presetGetAllByAgentId = async (agentId: string) => {
  try {
    const presets = await db.presets.findMany({
      where: { agentId },
    });

    return presets;
  } catch (error: any) {
    return [];
  }
};

