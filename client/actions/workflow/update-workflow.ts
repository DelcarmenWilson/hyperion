"use server";

import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";
import { WorkflowStatus } from "@/types/workflow/workflow";
import { revalidatePath } from "next/cache";

export const updateWorkflow = async ({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  const workflow = await db.workflow.findUnique({ where: { id, userId:user.id! } });
  if (!workflow) throw new Error("workflow not found");
  if (workflow.status !== WorkflowStatus.DRAFT)
    throw new Error("workflow is not a draft");

  const result = await db.workflow.update({
    where: { id, userId:user.id! },
    data: {
      definition,
    },
  });
  revalidatePath("/workflows");
};
