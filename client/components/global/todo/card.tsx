import React, { useState } from "react";
import { useTodoStore } from "@/hooks/user/use-todo";
import { cn } from "@/lib/utils";

import { UserTodo } from "@prisma/client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";

type Props = {
  todo: UserTodo;
};
export const TodoCard = ({ todo }: Props) => {
  const { todo: currentTodo, onTodoInfoOpen } = useTodoStore();
  const [status, setStatus] = useState(todo.status == "Pending" ? false : true);
  const { id, title, nextReminder } = todo;
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
        {nextReminder && (
          <p className="text-muted-foreground text-xs">
            {formatDate(nextReminder, "PPP h:mm aa")}
          </p>
        )}
      </div>
    </div>
  );
};
