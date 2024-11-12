import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useInvalidate } from "@/hooks/use-invalidate";

import { UserTodo } from "@prisma/client";
import { TodoSchemaType } from "@/schemas/user";

import { getTodo } from "@/actions/user/todo/get-todo";
import { getTodos } from "@/actions/user/todo/get-todos";
import { createTodo } from "@/actions/user/todo/create-todo";
import { completeTodo } from "@/actions/user/todo/complete-todo";
import { deleteTodo } from "@/actions/user/todo/delete-todo";
import { updateTodo } from "@/actions/user/todo/update-todo";
import { snoozeTodo } from "@/actions/user/todo/snooze-todo";

type State = {
  todo?: UserTodo;
  todoId?: string;
  isTodosOpen: boolean;
  isTodoInfoOpen: boolean;
  isTodoFormOpen: boolean;
  isTodoNotificationOpen: boolean;
};

type Actions = {
  setTodo: (t: UserTodo) => void;
  onTodosOpen: () => void;
  onTodosClose: () => void;
  onTodoInfoOpen: (t?: UserTodo) => void;
  onTodoInfoClose: () => void;
  onTodoFormOpen: (t?: UserTodo) => void;
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
  const { data: todos, isFetching: todosFetching,isLoading: todosLoading} = useQuery<UserTodo[] | []>(
    {
      queryFn: () => getTodos(),
      queryKey: ["todos"],
    }
  );
  return { todos, todosFetching, todosLoading };
  };
  const onTodoGet = () => {
  const { data: todo, isFetching: todoFetching,isLoading:todoLoading } = useQuery<UserTodo | null>({
    queryFn: () => getTodo(todoId as string),
    queryKey: [`todo-${todoId}`],
    enabled:!!todoId
  });
  return { todo, todoFetching, todoLoading };
  };

  return {
    onTodosGet,
    onTodoGet
  };
};

export const useTodoActions = () => {
  const { todo, setTodo, onTodoInfoOpen,onTodoInfoClose,onTodoNotificationClose } = useTodoStore();
  const { invalidate } = useInvalidate();

   //TODO DELETE
   const { mutate: todoDeleteMutate, isPending: todoDeleteing } =
   useMutation({
     mutationFn: deleteTodo,
     onSuccess: (results) => {
       if (results.success) {
         invalidate("todos");
         onTodoInfoClose()
         toast.success("Todo deleted successfully", { id: "delete-todo" });
       } else {
         toast.error(results.error, { id: "delete-todo" });
       }
     },
     onError: (error) => {
       toast.error(error.message, { id: "delete-todo" });
     },
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
      if (results.success) {
        toast.success("Todo has been added", { id: "insert-todo" });
        onTodoInfoOpen(results.success);
        invalidate("todos");
      } else {
        toast.error(results.error, { id: "insert-todo" });
      }
    },
    onError: (error) => {
      toast.error(error.message, { id: "insert-todo" });
    },
  });

  const onTodoInsert = useCallback(
    (values: TodoSchemaType) => {
      toast.loading("Creating Todo...", { id: "insert-todo" });
      todoInsertMutate(values);
    },
    [todoInsertMutate]
  );

  //TODO UPDATE
  const { mutate: todoUpdateMutate, isPending: todoUpdating } = useMutation({
    mutationFn: updateTodo,
    onSuccess: (results) => {
      if (results.success) {
        onTodoInfoOpen(results.success);
        invalidate("todos");
        toast.success("Todo has been updated!!", { id: "update-todo" });
      } else {
        toast.error(results.error, { id: "update-todo" });
      }
    },
    onError: (error) => {
      toast.error(error.message, { id: "update-todo" });
    },
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
        if (results.success) {
          invalidate("todos");
          if (todo?.id == results.success.id) {
            setTodo(results.success);
          }
          onTodoNotificationClose()
          toast.success("Todo has been completed!!", { id: "complete-todo" });
        } else {
          toast.error(results.error, { id: "complete-todo" });
        }
      },
      onError: (error) => {
        toast.error(error.message, { id: "complete-todo" });
      },
    });

  const onTodoComplete = useCallback(
    (id: string) => {
      toast.loading("Completing Todo...", { id: "complete-todo" });
      todoComepleteMutate(id);
    },
    [todoComepleteMutate]
  );

   //TODO SNOOZE
   const { mutate: todoSnoozeMutate, isPending: todoSnoozing } =
   useMutation({
     mutationFn: snoozeTodo,
     onSuccess: (results) => {
       if (results.success) {
         invalidate("todos");
         onTodoNotificationClose()
         toast.success("Todo has been rescheduled!!", { id: "snooze-todo" });
       } else {
         toast.error(results.error, { id: "snooze-todo" });
       }
     },
     onError: (error) => {
       toast.error(error.message, { id: "snooze-todo" });
     },
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
    onTodoSnooze,todoSnoozing
  };
};
