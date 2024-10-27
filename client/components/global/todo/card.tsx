import { InputGroup } from "@/components/reusable/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";
import { UserTodo } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  todo: UserTodo;
};
export const TodoCard = ({ todo }: Props) => {
  const [status, setStatus] = useState(todo.status == "Pending" ? false : true);
  const {
    id,
    userId,
    name,
    description,
    comments,
    reminder,
    startAt,
    endAt,
    createdAt,
    updatedAt,
  } = todo;
  return (
    <div className="flex items-center gap-2 border p-1">
      <Checkbox checked={status} />
      <p className="flex-1 text-sm whitespace-nowrap  overflow-ellipsis pe-2">
        {name}
      </p>
      {/* <InputGroup title="id" value={id} />
      <InputGroup title="status" value={status} />
      <InputGroup title="userId" value={userId} />
      <InputGroup title="name" value={name} />
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
