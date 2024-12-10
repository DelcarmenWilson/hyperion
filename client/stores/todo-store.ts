import { create } from "zustand";
import { FullTodo } from "@/types/todo";

type State = {
    todo?: FullTodo;
    todoId?: string;
    isTodosOpen: boolean;
    isTodoInfoOpen: boolean;
    isTodoFormOpen: boolean;
    isTodoNotificationOpen: boolean;
  };
  
  type Actions = {
    setTodo: (t: FullTodo) => void;
    onTodosOpen: () => void;
    onTodosClose: () => void;
    onTodoInfoOpen: (t?: FullTodo) => void;
    onTodoInfoClose: () => void;
    onTodoFormOpen: (t?: FullTodo) => void;
    onTodoFormClose: () => void;
    onTodoNotificationOpen: (t: string) => void;
    onTodoNotificationClose: () => void;
  };
  
  export const useTodoStore = create<State & Actions>((set) => ({
    isTodosOpen: false,
    onTodosOpen: () => set({ isTodosOpen: true }),
    onTodosClose: () =>
      set({
        isTodosOpen: false,
        isTodoInfoOpen: false,
        isTodoFormOpen: false,
        todo: undefined,
      }),
    isTodoInfoOpen: false,
    setTodo: (t) => set({ todo: t }),
    onTodoInfoOpen: (t) =>
      set({ isTodoInfoOpen: true, isTodoFormOpen: false, todo: t }),
    onTodoInfoClose: () => set({ isTodoInfoOpen: false, todo: undefined }),
    isTodoFormOpen: false,
    onTodoFormOpen: (t) =>
      set({ isTodoFormOpen: true, isTodoInfoOpen: false, todo: t }),
    onTodoFormClose: () => set({ isTodoFormOpen: false, todo: undefined }),
    isTodoNotificationOpen: false,
    onTodoNotificationOpen: (t) =>
      set({ isTodoNotificationOpen: true, todoId: t }),
    onTodoNotificationClose: () =>
      set({ isTodoNotificationOpen: false, todoId: undefined }),
  }));