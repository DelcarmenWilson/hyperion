"use client";
import { useTodoStore } from "@/hooks/user/use-todo";
import { DrawerExtendedSm } from "@/components/custom/drawer/extended-sm";
import { TodoInfo } from "./info";
import { TodoMenu } from "./menu";
import TodoShell from "./shell";

export const TodoContainer = () => {
  const { isTodosOpen, onTodosClose, isTodoInfoOpen } = useTodoStore();
  return (
    <DrawerExtendedSm
      title="Todos"
      menu={<TodoMenu />}
      isOpen={isTodosOpen}
      onClose={onTodosClose}
      sideDrawer={<TodoInfo />}
      sideDrawerOpen={isTodoInfoOpen}
      scroll={false}
      size="w-auto"
    >
      <TodoShell />
    </DrawerExtendedSm>
  );
};
