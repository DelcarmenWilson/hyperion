import React, { useState } from "react";
import { useTodoStore } from "@/hooks/user/use-todo";

import { UserTodo } from "@prisma/client";

import { InputGroup } from "@/components/reusable/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";

type Props = {
  todo: UserTodo;
};
export const TodoCard = ({ todo }: Props) => {
  const { onTodoInfoOpen } = useTodoStore();
  const [status, setStatus] = useState(todo.status == "Pending" ? false : true);
  const {
    id,
    userId,
    title,
    description,
    comments,
    reminder,
    startAt,
    endAt,
    createdAt,
    updatedAt,
  } = todo;
  return (
    <div className="flex items-center gap-2 border p-1 hover:bg-primary/25 cursor-pointer">
      <Checkbox checked={status} />
      <div
        className="flex-1  whitespace-nowrap overflow-ellipsis pe-2"
        onClick={() => onTodoInfoOpen(todo)}
      >
        <p className="text-sm">{title}</p>
      </div>
      {/* <InputGroup title="id" value={id} />
      <InputGroup title="status" value={status} />
      <InputGroup title="userId" value={userId} />
      <InputGroup title="title" value={title} />
      <InputGroup title="description" value={description} />
      <InputGroup title="comments" value={comments} />
      <InputGroup title="reminder" value={reminder.toString()} />
      <InputGroup title="startAt" value={formatDate(startAt)} />
      <InputGroup title="endAt" value={formatDate(endAt)} />
      <InputGroup title="createdAt" value={formatDate(createdAt)} />
      <InputGroup title="updatedAt" value={formatDate(updatedAt)} /> */}
    </div>
  );
};
