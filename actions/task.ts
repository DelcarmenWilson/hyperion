"use server"
import * as z from "zod";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import {  TaskSchema } from "@/schemas";


//DATA
export const tasksGetAll = async () => {
    try {
      const tasks = await db.task.findMany({orderBy:{startAt:"asc"}});
      return tasks;
    } catch (error) {
      return [];
    }
  };
  export const tasksGetAllPublished = async () => {
    try {
      const tasks = await db.task.findMany({where:{published:true},orderBy:{startAt:"asc"}});
      return tasks;
    } catch (error) {
      return [];
    }
  };
  export const taskGetById = async (id: string) => {
    try {
      const task = await db.task.findUnique({ where: { id } });
      return task;
    } catch (error) {
      return null;
    }
  };
  export const taskGetPrevNextById = async (id: string) => {
    try {
      const prev = await db.task.findMany({
        take: 1,
        select: { id: true },
        where: {
          id: {
            lt: id,
          },
        },
        orderBy: {
          id: "desc",
        },
      });
  
      const next = await db.task.findMany({
        take: 1,
        select: { id: true },
        where: {
          id: {
            gt: id,
          },
        },
        orderBy: {
          id: "asc",
        },
      });
      return { prev: prev[0]?.id || null, next: next[0]?.id || null };
    } catch {
      return null;
    }
  };


//ACTIONS
export const taskDeleteById = async (id:string
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
    return { error: "Task does not exists!" };
  }

  if(existingTask.published){
    return { error: "Please unpublish the task before deleting!" };
  }

  await db.task.delete({where: { id }  });

  return { success: `Task has been deleted!` };
};
export const taskInsert = async (
    values: z.infer<typeof TaskSchema>
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unathenticated" };
    }
    if (user.role !="ADMIN") {
      return { error: "Unauthorized" };
    }
    const validatedFields = TaskSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { headLine, description,published,comments,startAt,endAt } = validatedFields.data;
  
    const existingTask = await db.task.findFirst({ where: { headLine } });
    if (existingTask) {
      return { error: "Task already exists" };
    }
  
    const task = await db.task.create({
      data: {
        headLine,
        description,
        published,
        comments:comments?comments:"",
        startAt,
        endAt
      },
    });
  
    return { success: task };
  };
  export const taskUpdateById = async (
    values: z.infer<typeof TaskSchema>
  ) => {
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
  
    const { id,
      headLine ,
      description,
      status,
      comments,
      startAt,
      endAt } = validatedFields.data;
  
    const existingTask = await db.task.findUnique({ where: { id } });
    if (!existingTask) {
      return { error: "Task does not exists" };
    }
  
   await db.task.update({where: { id },
      data: {
        headLine ,
        description,
        status,
        comments,
        startAt,
        endAt 
      },
    });
  
    return { success: "Task updated" };
  };
  export const taskUpdateByIdPublished = async (id:string,published:boolean
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
  
   await db.task.update({where: { id },
      data: {
        published
      },
    });
  
    return { success: `Task has been ${published?"":"un"}published` };
  };