"use client";
import React from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useTodoActions,
  useTodoData,
  useTodoStore,
} from "@/hooks/user/use-todo";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const TodoNotification = () => {
  const { isTodoNotificationOpen, onTodoNotificationClose } = useTodoStore();

  const { onGetTodo } = useTodoData();
  const { todo, todoFetching } = onGetTodo();
  const { onCompleteTodo, todoCompleting, onSnoozeTodo, todoSnoozing } =
    useTodoActions();
  const loading = todoCompleting || todoSnoozing;
  return (
    <div
      className={cn(
        "fixed bottom-15 transition-[right] -right-full ease-in-out duration-500 w-full lg:w-[300px] z-[100] bg-gradient overflow-hidden rounded p-[1px]",
        isTodoNotificationOpen && "right-10"
      )}
    >
      <div className="relative flex flex-col bg-background  w-full gap-2 p-2 rounded-sm ">
        <div className="flex justify-between items-center">
          <p className="flex gap-2 items-center font-semibold text-sm text-muted-foreground">
            <Bell size={16} />
            Reminders
          </p>
          <Button
            variant="simple"
            size="icon"
            onClick={onTodoNotificationClose}
          >
            <X size={16} />
          </Button>
        </div>

        <SkeletonWrapper isLoading={todoFetching}>
          <p className="text-center text-primary font-bold">{todo?.title}</p>
          <div className="font-semibold truncate overflow-hidden text-sm italic">
            {todo?.description}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="gap-1"
              disabled={loading}
              variant="secondary"
              onClick={() => onSnoozeTodo(todo?.id!)}
            >
              Snooze
              <span className="text-xs">(5 minutes)</span>
            </Button>
            <Button
              disabled={loading}
              onClick={() => onCompleteTodo(todo?.id!)}
            >
              Complete
            </Button>
          </div>
        </SkeletonWrapper>
      </div>
    </div>
  );
};
