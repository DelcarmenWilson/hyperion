"use client";
import { ArrowRight, List } from "lucide-react";
import { useTodoActions, useTodoStore } from "@/hooks/user/use-todo";
import { Button } from "@/components/ui/button";
import { TodoForm } from "./form";

export const TodoInfo = () => {
  const { todo, onTodoInfoClose } = useTodoStore();
  const { onTodoInsert, todoInserting, onTodoUpdate, todoUpdating } =
    useTodoActions();

  return (
    <div className="flex gap-2 flex-col w-[500px] h-full p-4">
      <div className="flex gap-2 items-center border-b p-2">
        <div>
          <List size={16} />
        </div>

        <p className="text-center text-sm font-semibold text-nowrap overflow-hidden text-ellipsis">
          {todo ? todo.title : "New Todo"}
        </p>

        <Button size="sm" className="ml-auto" onClick={onTodoInfoClose}>
          <span className="sr-only">Close panel</span>
          <ArrowRight size={16} />
        </Button>
      </div>
      <TodoForm
        key={todo?.id || "new-todo"}
        todo={todo}
        onSubmit={todo ? onTodoUpdate : onTodoInsert}
        loading={todo ? todoUpdating : todoInserting}
      />
    </div>
  );
};
