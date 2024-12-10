import React from "react";
import { useTodoStore } from "@/stores/todo-store";
import { cn } from "@/lib/utils";

import { UserTodo } from "@prisma/client";

import { formatDate } from "@/formulas/dates";

type Props = {
  todo: UserTodo;
};
export const TodoCard = ({ todo }: Props) => {
  const { todo: currentTodo, onTodoInfoOpen } = useTodoStore();
  const { id, title, startAt, description } = todo;
  return (
    <div
      className={cn(
        "flex items-start gap-2 border p-2 hover:bg-primary/25 cursor-pointer rounded",
        currentTodo?.id == id && "bg-primary/25"
      )}
    >
      <div
        className="relative flex-1 flex-col whitespace-nowrap overflow-ellipsis pe-2"
        onClick={() => onTodoInfoOpen(todo)}
      >
        {startAt && (
          <p className="absolute top-0 right-0 text-muted-foreground text-xs italic">
            {formatDate(startAt, "MM-dd-yy h:mm aa")}
          </p>
        )}

        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground truncate text-ellipsis">
          {description}
        </p>
      </div>
    </div>
  );
};
