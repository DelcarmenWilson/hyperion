"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TriggerSchema, TriggerSchemaType } from "@/schemas/trigger";

//DATA
export const triggersGetAll = async () => {
  const triggers = await db.trigger.findMany();
  return triggers;
};
export const triggerGetById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const trigger = await db.trigger.findUnique({
    where: { id },
  });
  return trigger;
};

//ACTIONS
export const triggerInsert = async (values: TriggerSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = TriggerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, data, type } = validatedFields.data;

  const existingTrigger = await db.trigger.findFirst({
    where: { name },
  });

  if (existingTrigger) {
    return { error: "Trigger with this name already exists!!" };
  }

  const newTrigger = await db.trigger.create({
    data: {
      name,
      data,
      type,
    },
  });
  return { success: newTrigger };
};

export const triggerUpdateById = async (values: TriggerSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = TriggerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, name, type, data } = validatedFields.data;

  const existingTrigger = await db.trigger.findUnique({ where: { id } });

  if (!existingTrigger) {
    return { error: "Trigger does not exists!!" };
  }

  const updatedTrigger = await db.trigger.update({
    where: { id },
    data: {
      name,
      type,
      data,
    },
  });
  return { success: updatedTrigger };
};

export const triggerDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingTrigger = await db.trigger.findUnique({ where: { id } });

  if (!existingTrigger) {
    return { error: "Trigger does not exists!!" };
  }

  await db.trigger.delete({ where: { id: existingTrigger.id } });
  return { success: "WorkFlow deleted!!" };
};
