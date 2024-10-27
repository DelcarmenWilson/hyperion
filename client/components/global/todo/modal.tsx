"use client";
import { useTodoStore } from "@/hooks/user/use-todo";

import { TodoDrawer } from "./drawer";
import TodoShell from "./shell";

export const TodoModal = () => {
  const { isTodosModalOpen, onTodosModalClose } = useTodoStore();
  return (
    <TodoDrawer
      title="Todos"
      isOpen={isTodosModalOpen}
      onClose={onTodosModalClose}
      scroll={false}
      size="w-auto"
    >
      <TodoShell />
    </TodoDrawer>
  );
};
