"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { TaskSchema, TaskSchemaType } from "@/schemas/admin";

export const taskDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role != "ADMIN") {
    return { error: "Unauthorized" };
  }
  const existingTask = await db.task.findUnique({ where: { id } });
  if (!existingTask) {
    return { error: "Task does not exists!" };
  }

  if (existingTask.published) {
    return { error: "Please unpublish the task before deleting!" };
  }

  await db.task.delete({ where: { id } });

  return { success: `Task has been deleted!` };
};
export const taskInsert = async (values: TaskSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role != "ADMIN") {
    return { error: "Unauthorized" };
  }
  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { headLine, description, published, comments, startAt, endAt } =
    validatedFields.data;

  const existingTask = await db.task.findFirst({ where: { headLine } });
  if (existingTask) {
    return { error: "Task already exists" };
  }

  const task = await db.task.create({
    data: {
      headLine,
      description,
      published,
      comments: comments ? comments : "",
      startAt,
      endAt,
    },
  });

  return { success: task };
};
export const taskUpdateById = async (values: TaskSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role != "ADMIN") {
    return { error: "Unauthorized" };
  }
  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, headLine, description, status, comments, startAt, endAt } =
    validatedFields.data;

  const existingTask = await db.task.findUnique({ where: { id } });
  if (!existingTask) {
    return { error: "Task does not exists" };
  }

  await db.task.update({
    where: { id },
    data: {
      headLine,
      description,
      status,
      comments,
      startAt,
      endAt,
    },
  });

  return { success: "Task updated" };
};
export const taskUpdateByIdPublished = async (
  id: string,
  published: boolean
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role != "ADMIN") {
    return { error: "Unauthorized" };
  }
  const existingTask = await db.task.findUnique({ where: { id } });
  if (!existingTask) {
    return { error: "Task does not exists" };
  }

  await db.task.update({
    where: { id },
    data: {
      published,
    },
  });

  return { success: `Task has been ${published ? "" : "un"}published` };
};
