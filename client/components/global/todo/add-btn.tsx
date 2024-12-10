import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/stores/todo-store";
import { Plus } from "lucide-react";
import React from "react";

export const AddTodoBtn = ({ text }: { text?: string }) => {
  const { onTodoFormOpen } = useTodoStore();
  return (
    <Button
      variant="outlineprimary"
      size="xs"
      className="gap-2"
      onClick={() => onTodoFormOpen()}
    >
      <Plus size={15} /> {text}
    </Button>
  );
};
