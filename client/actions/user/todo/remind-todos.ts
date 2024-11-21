"use server";
import { db } from "@/lib/db";
import { TodoReminderMethod } from "@/types/todo";

import { sendTodoReminderEmail } from "@/lib/mail";
import { sendSocketData } from "@/services/socket-service";
import { smsSend } from "@/actions/sms";
import { createEmail } from "@/actions/email/create-email";

export const remindTodos = async () => {
  const startDate = new Date();
  //TODO - dont forget to remove this an allow the other line
  // startDate.setHours(startDate.getHours() - 1);
  startDate.setSeconds(startDate.getSeconds() -5);
  const endDate = new Date();
  // endDate.setHours(endDate.getHours() + 1);
  endDate.setSeconds(endDate.getSeconds() + 10);

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
            message: `Hyperion Reminders: \n ${todo.title} \n -${todo.description} `,
          });
        }
        break;
      case TodoReminderMethod.Email:
        if (todo.user.email) {
          const email = await sendTodoReminderEmail({
            email: todo.user.email,
            todoId: todo.id,
            title: todo.title,
            description: todo.description,
            username: todo.user.userName,
            comments: todo.comments,
            dueDate: todo.startAt!,
          });
          if (email.data) {
            await createEmail({
              id: email.data.id as string,
              type: "react-email",
              body: "TodoReminderEmail",
              subject: "Task Reminder",
              leadId: undefined,
              userId: todo.userId,
            });
          }
        }
        break;
    }
  }
};
