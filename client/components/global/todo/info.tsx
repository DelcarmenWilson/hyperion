"use client";
import { ArrowRight, List } from "lucide-react";
import { useTodoActions, useTodoStore } from "@/hooks/user/use-todo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TodoForm } from "./form";

export const TodoInfo = () => {
  const { todo, isTodoInfoOpen, onTodoInfoClose } = useTodoStore();
  const { onTodoInsert, todoInserting, onTodoUpdate, todoUpdating } =
    useTodoActions();

  return (
    <div className="flex flex-1 justify-start relative overflow-hidden">
      <div
        className={cn(
          "flex  flex-col relative transition-[right] -right-full bg-background ease-in-out duration-600 h-full w-full overflow-hidden",
          isTodoInfoOpen && "right-0"
        )}
      >
        <div className="flex gap-2 flex-col w-[500px] h-full p-4">
          <div className="flex gap-2 items-center border-b p-2">
            <List size={16} />
            <p>
              <span className="text-lg font-bold">
                {todo ? todo.title : "New Todo"}
              </span>
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
      </div>
    </div>
  );
};
