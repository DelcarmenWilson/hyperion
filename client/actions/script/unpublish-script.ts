"use server";
import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptStatus } from "@/types/script";
import { revalidatePath } from "next/cache";

export const unPublishScript = async ({
  id,
}: {
  id: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  const script = await db.script.findUnique({ where: { id, userId:user.id! } });
  if (!script) throw new Error("script not found");

  await db.script.update({
    where: { id, userId:user.id! },
    data: {
      status:ScriptStatus.DRAFT,
      active:false
    },
  });
  revalidatePath("/admin/scripts");
  revalidatePath(`/admin/scripts/${id}`);
};
