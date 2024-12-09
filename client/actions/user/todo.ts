"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { sendTodoReminderEmail } from "@/lib/mail";

import { TodoSchema, TodoSchemaType } from "@/schemas/user";
import { TodoStatus } from "@/types/todo";

import { TodoReminderMethod } from "@/types/todo";

import { sendSocketData } from "@/services/socket-service";
import { createEmail } from "@/actions/email/create-email";
import { smsSend } from "@/actions/sms";

// DATA
export const getTodo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTodo.findUnique({
    where: { id, userId: user.id },
    include: { category: true },
  });
};

export const getTodos = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTodo.findMany({
    where: { userId: user.id },
    include: { category: true },
  });
};

// ACTIONS
export const createTodo = async (values: TodoSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { success, data } = TodoSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const nextReminder = data.reminder ? data.startAt : undefined;

  return await db.userTodo.create({
    data: {
      userId: user.id,
      ...data,
      nextReminder,
      status: TodoStatus.PENDING,
    },
  });
};

export const deleteTodo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await db.userTodo.delete({
    where: {
      id,
      userId: user.id,
    },
  });
};
export const updateTodo = async (values: TodoSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { success, data } = TodoSchema.safeParse(values);
  if (!success) throw new Error("UnauthenticatedInvalid fields!");

  return await db.userTodo.update({
    where: { id: data.id, userId: user.id },
    data: {
      ...data,
    },
  });
};

export const completeTodo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTodo.update({
    where: { id, userId: user.id },
    data: {
      status: TodoStatus.COMPLETED,
      nextReminder: undefined,
    },
  });
};

export const remindTodos = async (test: boolean = false) => {
  const startDate = new Date();
  const endDate = new Date();
  if (test) {
    startDate.setHours(startDate.getHours() - 1);
    endDate.setHours(endDate.getHours() + 1);
  } else {
    startDate.setSeconds(startDate.getSeconds() - 5);
    endDate.setSeconds(endDate.getSeconds() + 10);
  }

  const todos = await db.userTodo.findMany({
    where: {
      reminder: true,
      nextReminder: {
        gte: startDate,
        lte: endDate,
      },
      status:TodoStatus.PENDING
    },
    select: {
      id: true,
      title: true,
      description: true,
      comments: true,
      startAt: true,
      userId: true,
      reminderMethod: true,
      user: {
        select: {
          email: true,
          userName: true,
          phoneSettings: { select: { personalNumber: true } },
          phoneNumbers: {
            where: { status: "Default" },
            select: { phone: true },
          },
        },
      },
    },
  });

  const sendTodoSms = async ({
    personalNumber,
    hyperionNumber,
    title,
    description,
  }: {
    personalNumber: string | null | undefined;
    hyperionNumber: string;
    title: string;
    description: string;
  }) => {
    if (personalNumber && hyperionNumber) {
      await smsSend({
        fromPhone: hyperionNumber,
        toPhone: personalNumber,
        message: `Hyperion Reminders: \n ${title} \n -${description} `,
      });
    }
  };

  const sendTodoEmail = async ({
    id,
    email,
    title,
    description,
    userId,
    username,
    comments,
    dueDate,
  }: {
    id: string;
    email: string | null;
    title: string;
    description: string;
    userId: string;
    username: string;
    comments: string;
    dueDate: Date;
  }) => {
    if (email) {
      const createdEmail = await sendTodoReminderEmail({
        email,
        todoId: id,
        title,
        description,
        username,
        comments,
        dueDate,
      });
      if (createdEmail.data) {
        await createEmail({
          id: createdEmail.data.id as string,
          type: "react-email",
          body: "TodoReminderEmail",
          subject: "Task Reminder",
          leadId: undefined,
          userId,
        });
      }
    }
  };

  for (const todo of todos) {
    const method = todo.reminderMethod as TodoReminderMethod;
    //- always sent the noticication to the agents front end.
    await sendSocketData(todo.userId, "todo:reminder", todo.id);
    const personalNumber = todo.user.phoneSettings?.personalNumber;
    const hyperionNumber = todo.user.phoneNumbers[0].phone;

    
    switch (method) {
      case TodoReminderMethod.SMS:
        await sendTodoSms({
          personalNumber,
          hyperionNumber,
          title: todo.title,
          description: todo.description,
        });
        break;
      case TodoReminderMethod.EMAIL:
        await sendTodoEmail({id: todo.id,
          email: todo.user.email,      
          title: todo.title,
          description: todo.description,
          userId: todo.userId,
          username: todo.user.userName,
          comments: todo.comments,
          dueDate: todo.startAt!});
        
        break;
      case TodoReminderMethod.EMAIL_AND_SMS:
         await sendTodoSms({
          personalNumber,
          hyperionNumber,
          title: todo.title,
          description: todo.description,
        });
         await sendTodoEmail({id: todo.id,
          email: todo.user.email,      
          title: todo.title,
          description: todo.description,
          userId: todo.userId,
          username: todo.user.userName,
          comments: todo.comments,
          dueDate: todo.startAt!});
        break;
    }
  }
};

export const snoozeTodo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const nextReminder = new Date();
  nextReminder.setMinutes(nextReminder.getMinutes() + 5);

  return await db.userTodo.update({
    where: { id, userId: user.id },
    data: {
      nextReminder: nextReminder,
    },
  });
};
