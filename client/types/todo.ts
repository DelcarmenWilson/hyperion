import { UserTodo,UserTodoCategory } from "@prisma/client";

export enum TodoStatus{
    PENDING="Pending",
    COMPLETED="Completed"
}

export enum TodoReminderMethod{
    NOTIFICATION="NOTIFICATION",
    EMAIL="EMAIL",
    SMS="SMS",
    EMAIL_AND_SMS="EMAIL_AND_SMS"
}

export type FullTodo = UserTodo & {category?:UserTodoCategory|null}