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
  const { id, title, startAt } = todo;
  const status = todo.status == TodoStatus.COMPLETED;
  return (
    <div
      className={cn(
        "flex items-center gap-2 border p-1 hover:bg-primary/25 cursor-pointer",
        currentTodo?.id == id && "bg-primary/25"
      )}
    >
      <Checkbox checked={status} />
      <div
        className="flex-1 flex-col whitespace-nowrap overflow-ellipsis pe-2"
        onClick={() => onTodoInfoOpen(todo)}
      >
        <p className="text-sm">{title}</p>
        {startAt && (
          <p className="text-muted-foreground text-xs">
            {formatDate(startAt, "PPP h:mm aa")}
          </p>
        )}
      </div>
    </div>
  );
};
