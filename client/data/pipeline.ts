import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { userGetByAssistant } from "@/data/user";

export const pipelineGetAllByAgentId = async (userId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const pipelines = await db.pipeLine.findMany({
      where: { userId },
      include: { status: { select: { status: true } } },
      orderBy: { order: "asc" },
    });
    return pipelines;
  } catch {
    return [];
  }
};