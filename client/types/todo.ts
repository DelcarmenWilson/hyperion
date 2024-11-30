import { UserTodo,UserTodoCategory } from "@prisma/client";

export enum TodoStatus{
    PENDING="Pending",
    COMPLETED="Completed"
}

export enum TodoReminderMethod{
    Notification="Notification",
    Email="Email",
    Sms="Sms",
    EmailSms="Email And Sms"
}

export type FullTodo = UserTodo & {category?:UserTodoCategory|null}