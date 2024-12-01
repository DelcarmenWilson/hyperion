import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";
import { toast } from "sonner";

import { UserTodo } from "@prisma/client";
import { TodoSchemaType } from "@/schemas/user";

import { FullTodo } from "@/types/todo";

import {
  getTodo,
  getTodos,
  createTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
  snoozeTodo,
} from "@/actions/user/todo";
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

export const useTodoData = () => {
  const { todoId } = useTodoStore();
  const onTodosGet = () => {
    const {
      data: todos,
      isFetching: todosFetching,
      isLoading: todosLoading,
    } = useQuery<FullTodo[] | []>({
      queryFn: () => getTodos(),
      queryKey: ["todos"],
    });
    return { todos, todosFetching, todosLoading };
  };
  const onTodoGet = () => {
    const {
      data: todo,
      isFetching: todoFetching,
      isLoading: todoLoading,
    } = useQuery<FullTodo | null>({
      queryFn: () => getTodo(todoId as string),
      queryKey: [`todo-${todoId}`],
      enabled: !!todoId,
    });
    return { todo, todoFetching, todoLoading };
  };

  return {
    onTodosGet,
    onTodoGet,
  };
};

export const useTodoActions = () => {
  const {
    todo,
    setTodo,
    onTodoInfoOpen,
    onTodoInfoClose,
    onTodoNotificationClose,
  } = useTodoStore();
  const { invalidate } = useInvalidate();

  //TODO DELETE
  const { mutate: todoDeleteMutate, isPending: todoDeleteing } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      invalidate("todos");
      onTodoInfoClose();
      toast.success("Todo deleted successfully", { id: "delete-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "delete-todo" }),
  });

  const onTodoDelete = useCallback(
    (id: string) => {
      toast.loading("Deleting todo...", { id: "delete-todo" });
      todoDeleteMutate(id);
    },
    [todoDeleteMutate]
  );

  //TODO INSERT
  const { mutate: todoInsertMutate, isPending: todoInserting } = useMutation({
    mutationFn: createTodo,
    onSuccess: (results) => {
      toast.success("Todo has been added", { id: "create-todo" });
      onTodoInfoOpen(results);
      invalidate("todos");
    },
    onError: (error) => {
      toast.error(error.message, { id: "create-todo" });
    },
  });

  const onTodoInsert = useCallback(
    (values: TodoSchemaType) => {
      toast.loading("Creating Todo...", { id: "create-todo" });
      todoInsertMutate(values);
    },
    [todoInsertMutate]
  );

  //TODO UPDATE
  const { mutate: todoUpdateMutate, isPending: todoUpdating } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      invalidate("todos");
      toast.success("Todo has been updated!!", { id: "update-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "update-todo" }),
  });

  const onTodoUpdate = useCallback(
    (values: TodoSchemaType) => {
      toast.loading("Updating Todo...", { id: "update-todo" });
      todoUpdateMutate(values);
    },
    [todoUpdateMutate]
  );
  //TODO COMPLETE
  const { mutate: todoComepleteMutate, isPending: todoCompleting } =
    useMutation({
      mutationFn: completeTodo,
      onSuccess: (results) => {
        invalidate("todos");
        if (todo?.id == results.id) setTodo(results);

        onTodoNotificationClose();
        toast.success("Todo has been completed!!", { id: "complete-todo" });
      },
      onError: (error) => toast.error(error.message, { id: "complete-todo" }),
    });

  const onTodoComplete = useCallback(
    (id: string) => {
      toast.loading("Completing Todo...", { id: "complete-todo" });
      todoComepleteMutate(id);
    },
    [todoComepleteMutate]
  );

  //TODO SNOOZE
  const { mutate: todoSnoozeMutate, isPending: todoSnoozing } = useMutation({
    mutationFn: snoozeTodo,
    onSuccess: (results) => {
      invalidate("todos");
      onTodoNotificationClose();
      toast.success("Todo has been rescheduled!!", { id: "snooze-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "snooze-todo" }),
  });

  const onTodoSnooze = useCallback(
    (id: string) => {
      toast.loading("Rescheduling Todo...", { id: "snooze-todo" });
      todoSnoozeMutate(id);
    },
    [todoSnoozeMutate]
  );

  return {
    onTodoDelete,
    todoDeleteing,
    onTodoInsert,
    todoInserting,
    onTodoUpdate,
    todoUpdating,
    onTodoComplete,
    todoCompleting,
    onTodoSnooze,
    todoSnoozing,
  };
};
