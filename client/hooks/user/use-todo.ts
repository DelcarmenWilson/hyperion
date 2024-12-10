import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";
import { useTodoStore } from "@/stores/todo-store";
import { toast } from "sonner";

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



export const useTodoData = () => {
  const { todoId } = useTodoStore();
  const onGetTodos = () => {
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
  const onGetTodo = () => {
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
    onGetTodos,
    onGetTodo,
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

  //CREATE TODO
  const { mutate: createTodoMutate, isPending: todoCreating } = useMutation({
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

  const onCreateTodo = useCallback(
    (values: TodoSchemaType) => {
      toast.loading("Creating Todo...", { id: "create-todo" });
      createTodoMutate(values);
    },
    [createTodoMutate]
  );
  //DELETE TODO
  const { mutate: deleteTodoMutate, isPending: todoDeleteing } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      invalidate("todos");
      onTodoInfoClose();
      toast.success("Todo deleted successfully", { id: "delete-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "delete-todo" }),
  });

  const onDeleteTodo = useCallback(
    (id: string) => {
      toast.loading("Deleting todo...", { id: "delete-todo" });
      deleteTodoMutate(id);
    },
    [deleteTodoMutate]
  );

  //UPDATE TODO
  const { mutate: updateTodoMutate, isPending: todoUpdating } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      invalidate("todos");
      toast.success("Todo has been updated!!", { id: "update-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "update-todo" }),
  });

  const onUpdateTodo = useCallback(
    (values: TodoSchemaType) => {
      toast.loading("Updating Todo...", { id: "update-todo" });
      updateTodoMutate(values);
    },
    [updateTodoMutate]
  );
  //COMPLETE TODO
  const { mutate: completeTodoMutate, isPending: todoCompleting } = useMutation(
    {
      mutationFn: completeTodo,
      onSuccess: (results) => {
        invalidate("todos");
        if (todo?.id == results.id) setTodo(results);
        onTodoNotificationClose();
        toast.success("Todo has been completed!!", { id: "complete-todo" });
      },
      onError: (error) => toast.error(error.message, { id: "complete-todo" }),
    }
  );

  const onCompleteTodo = useCallback(
    (id: string) => {
      toast.loading("Completing Todo...", { id: "complete-todo" });
      completeTodoMutate(id);
    },
    [completeTodoMutate]
  );

  //SNOOZE TODO
  const { mutate: snoozeTodoMutate, isPending: todoSnoozing } = useMutation({
    mutationFn: snoozeTodo,
    onSuccess: () => {
      invalidate("todos");
      onTodoNotificationClose();
      toast.success("Todo has been rescheduled!!", { id: "snooze-todo" });
    },
    onError: (error) => toast.error(error.message, { id: "snooze-todo" }),
  });

  const onSnoozeTodo = useCallback(
    (id: string) => {
      toast.loading("Rescheduling Todo...", { id: "snooze-todo" });
      snoozeTodoMutate(id);
    },
    [snoozeTodoMutate]
  );

  return {
    onDeleteTodo,
    todoDeleteing,
    onCreateTodo,
     todoCreating,
    onUpdateTodo,
    todoUpdating,
    onCompleteTodo,
    todoCompleting,
    onSnoozeTodo,
    todoSnoozing,
  };
};
