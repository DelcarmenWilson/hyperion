import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/hooks/user/use-todo";
import { Plus } from "lucide-react";
import React from "react";

export const TodoMenu = () => {
  const { onTodoInfoOpen } = useTodoStore();
  return (
    <Button size="sm" onClick={() => onTodoInfoOpen()}>
      <Plus size={16} />
    </Button>
  );
};
