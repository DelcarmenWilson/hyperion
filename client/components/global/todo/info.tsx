"use client";
import { ArrowRight, Edit, List } from "lucide-react";
import { useTodoStore } from "@/stores/todo-store";
import { useTodoActions } from "@/hooks/user/use-todo";

import { TodoStatus } from "@/types/todo";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataDisplayItalic } from "../data-display/data-display";
import DeleteDialog from "@/components/custom/delete-dialog";

import { formatDate } from "@/formulas/dates";

export const TodoInfo = () => {
  const { todo, onTodoInfoClose, isTodoInfoOpen, onTodoFormOpen } =
    useTodoStore();
  const { onCompleteTodo, todoCompleting, onDeleteTodo, todoDeleteing } =
    useTodoActions();

  if (!todo || !isTodoInfoOpen) return null;

  const {
    id,
    title,
    description,
    status,
    comments,
    startAt,
    endAt,
    reminder,
    reminderMethod,
    nextReminder,
    category,
  } = todo;
  const isPending = status == TodoStatus.PENDING;

  return (
    <div className="flex gap-2 flex-col w-[500px] h-full p-4">
      <div className="flex gap-2 items-center border-b p-2">
        <div className="shrink-0">
          <List size={16} />
        </div>
        <p className="text-center text-sm font-semibold text-nowrap overflow-hidden text-ellipsis capitalize">
          {todo ? todo.title : "New Todo"}
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <DeleteDialog
            title="todo"
            cfText={title}
            onConfirm={() => onDeleteTodo(todo.id)}
            loading={todoDeleteing}
          />
          <Button size="sm" className="ml-auto" onClick={onTodoInfoClose}>
            <span className="sr-only">Close Todo Info Panel</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <div className="relative space-y-2 pt-4">
        <Badge className="absolute top-0 left-0" variant="gradient">
          {status}
        </Badge>

        {isPending && (
          <Button
            className="absolute top-0 right-0 gap-2 !m-0"
            size="sm"
            variant="ghost"
            onClick={() => onTodoFormOpen(todo)}
          >
            <Edit size={15} /> Edit
          </Button>
        )}
        <p className="text-xl text-primary text-center font-bold capitalize">
          {title}
        </p>

        <Box title="Category" value={category?.name} />
        <Box title="Description" value={description} />
        <Box title="Comments" value={comments} />

        {reminder && (
          <div className="p-2">
            <div className="bg-gradient p-1">
              <p className="text-center bg-background text-primary font-bold p-1">
                Reminder settings
              </p>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <DataDisplayItalic
                title="Start Date"
                value={startAt ? formatDate(startAt) : "No set"}
              />
              <DataDisplayItalic
                title="End Date"
                value={endAt ? formatDate(endAt) : "Continuios"}
              />

              <DataDisplayItalic
                title="Method"
                value={reminderMethod ?? "No set"}
              />
              <DataDisplayItalic
                title="Next Reminder"
                value={
                  nextReminder
                    ? formatDate(nextReminder, "MM-dd-yy h:mm aa")
                    : "No set"
                }
              />
            </div>
          </div>
        )}

        {isPending && (
          <div className="text-right pe-2">
            <Button
              variant="outlineprimary"
              disabled={todoCompleting}
              onClick={() => onCompleteTodo(todo.id)}
            >
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
const Box = ({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) => {
  return (
    <div className="border border-separate p-2">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-foreground font-semibold pl-3">{value}</p>
    </div>
  );
};
