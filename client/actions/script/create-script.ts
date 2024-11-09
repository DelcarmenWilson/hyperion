"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createScriptSchema, createScriptSchemaType } from "@/schemas/script";

import { UPPERADMINS } from "@/constants/user";
import { ScriptStatus } from "@/types/script";

export const createScript = async (values: createScriptSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("unathenticated");
  const { success, data } = createScriptSchema.safeParse(values);
  if (!success) throw new Error("invalid data");

  const df = UPPERADMINS.includes(user!.role) ? true : false;

  const results = await db.script.create({
    data: {
      ...data,
      content: JSON.stringify('{"ops":[{"insert":"\n"}]}'),
      userId: user.id!,
      default: df,
      status: ScriptStatus.DRAFT,
    },
  });

  if (!results) throw new Error("failed to create script");
  redirect(`/admin/scripts/${results.id}`);
};
