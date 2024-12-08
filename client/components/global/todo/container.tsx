"use client";
import { useTodoStore } from "@/hooks/user/use-todo";

import { AddTodoBtn } from "./add-btn";
import { DrawerExtendedSm } from "@/components/custom/drawer/extended-sm";
import { TodoInfo } from "./info";
import TodoForm from "./form";
import TodoShell from "./shell";

export const TodoContainer = () => {
  const { isTodosOpen, onTodosClose, isTodoInfoOpen, isTodoFormOpen } =
    useTodoStore();
  return (
    <DrawerExtendedSm
      title="Todos"
      menu={<AddTodoBtn />}
      isOpen={isTodosOpen}
      onClose={onTodosClose}
      sideDrawer={
        <>
          <TodoInfo />
          <TodoForm />
        </>
      }
      sideDrawerOpen={isTodoInfoOpen || isTodoFormOpen}
      scroll={false}
      size="w-auto"
    >
      <TodoShell />
    </DrawerExtendedSm>
  );
};
