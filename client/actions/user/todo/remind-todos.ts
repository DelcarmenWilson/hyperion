"use server";
import { db } from "@/lib/db";
import { TodoReminderMethod } from "@/types/todo";

import { sendTodoReminderEmail } from "@/lib/mail";
import { sendSocketData } from "@/services/socket-service";
import { smsSend } from "@/actions/sms";

export const remindTodos = async () => {
  const startDate = new Date();
   startDate.setHours(startDate.getHours() - 1);
  const endDate = new Date();
  endDate.setSeconds(endDate.getSeconds() + 30);

  const todos = await db.userTodo.findMany({
    where: {
      reminder: true,
      nextReminder: {
        gte: startDate,
        lte: endDate,
      },
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

  for (const todo of todos) {
    const method = todo.reminderMethod as TodoReminderMethod;

    switch (method) {
      case TodoReminderMethod.Notification:
        await sendSocketData(todo.userId, "todo:reminder", todo.id);
        break;
      case TodoReminderMethod.Phone:
        const personalNumber = todo.user.phoneSettings?.personalNumber;
        const hyperionNumber = todo.user.phoneNumbers[0].phone;

        if (personalNumber && hyperionNumber) {
          await smsSend({
            fromPhone: hyperionNumber,
            toPhone: personalNumber,
            message: `Hyperion Reminders: \n ${todo.title} `,
          });
        }
        break;
      case TodoReminderMethod.Email:
        if (todo.user.email) {
          await sendTodoReminderEmail({
            email: todo.user.email,
            todoId: todo.id,
            title: todo.title,
            description: todo.description,
            username: todo.user.userName,
            comments: todo.comments,
            dueDate: todo.startAt!,
          });
        }
        break;
    }
  }
};
