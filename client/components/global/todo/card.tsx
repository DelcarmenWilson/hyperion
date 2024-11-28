import React, { useState } from "react";
import { useTodoStore } from "@/hooks/user/use-todo";
import { cn } from "@/lib/utils";

import { UserTodo } from "@prisma/client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";
import { TodoStatus } from "@/types/todo";

type Props = {
  todo: UserTodo;
};
export const TodoCard = ({ todo }: Props) => {
  const { todo: currentTodo, onTodoInfoOpen } = useTodoStore();
  const { id, title, startAt, description, status } = todo;
  const todoStatus = status == TodoStatus.COMPLETED;
  return (
    <div
      className={cn(
        "flex items-start gap-2 border p-1 hover:bg-primary/25 cursor-pointer",
        currentTodo?.id == id && "bg-primary/25"
      )}
    >
      <Checkbox checked={todoStatus} />
      <div
        className="relative flex-1 flex-col whitespace-nowrap overflow-ellipsis pe-2"
        onClick={() => onTodoInfoOpen(todo)}
      >
        {startAt && (
          <p className="absolute top-0 right-0 text-muted-foreground text-xs">
            {formatDate(startAt, "MM-dd-yy h:mm aa")}
          </p>
        )}

        <p className="text-sm">{title}</p>
        <p className="text-muted-foreground truncate text-ellipsis">
          {description}
        </p>
      </div>
    </div>
  );
};
