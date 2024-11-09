"use server";
import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptStatus } from "@/types/script";
import { revalidatePath } from "next/cache";

export const updateScript = async ({
  id,
  content,
}: {
  id: string;
  content: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  const script = await db.script.findUnique({ where: { id, userId:user.id! } });
  if (!script) throw new Error("script not found");
  if (script.status !== ScriptStatus.DRAFT)
    throw new Error("script is not a draft");

  await db.script.update({
    where: { id, userId:user.id! },
    data: {
      content,
    },
  });
  revalidatePath("/admin/scripts");
};
