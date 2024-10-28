import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserTodo } from "@prisma/client";


import { userTodoGetAll, userTodoInsert, userTodoUpdateById } from "@/actions/user/todo";
import { UserTodoSchemaType } from "@/schemas/user";

type State = {
  todo?: UserTodo;
  isTodosOpen: boolean;
   isTodoInfoOpen: boolean;
  // isTodoFormOpen: boolean;
};

type Actions = {
  setTodo:(t:UserTodo)=>void
  onTodosOpen: () => void;
  onTodosClose: () => void;
  onTodoInfoOpen: (t?:UserTodo) => void;
  onTodoInfoClose: () => void;
  // onTodoFormOpen: (t:UserTodo) => void;
  // onTodoFormClose: () => void;
};

export const useTodoStore = create<State & Actions>((set) => ({
  isTodosOpen: false,
  onTodosOpen: () => set({isTodosOpen: true}),
  onTodosClose: () => set({isTodosOpen: false,isTodoInfoOpen:false,todo:undefined}),
  isTodoInfoOpen:false,
  setTodo:(t)=> set({todo: t }),
  onTodoInfoOpen: (t) => set({isTodoInfoOpen: true,todo:t }),
  onTodoInfoClose: () => set({isTodoInfoOpen: false,todo:undefined}),
  // isTodoFormOpen: false,
  // setTodo:(t)=> set({todo: t }),
  // onTodoFormOpen: (t) => set({isTodoFormOpen: true,todo:t }),
  // onTodoFormClose: () => set({isTodoFormOpen: false,todo:undefined}),
}));

export const useTodoData = () => {
  const { data: todos, isFetching: isFetchingTodo } =
    useQuery<UserTodo[] | []>({
      queryFn: () => userTodoGetAll(),
      queryKey: ["todos"],
    }); 

  return {
    todos, isFetchingTodo
  };
};

export const useTodoActions = () => {
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  //TODO INSERT
  const {mutate: todoInsertMutate,isPending: todoInserting,} = useMutation({
    mutationFn: userTodoInsert,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Todo has been added", {id: "insert-todo",});        
        invalidate("todos")
      } else {
        toast.error(results.error, { id: "insert-todo" });
      }
    },
    onError: (error) => {
      toast.error(error.message, { id: "insert-todo" });
    },
  });

  const onTodoInsert = useCallback(
    (values: UserTodoSchemaType) => {
      toast.loading("Creating Todo...", { id: "insert-todo" });
      todoInsertMutate(values);
    },
    [todoInsertMutate]
  );

  //TODO UPDATE
  const {mutate: todoUpdateMutate,isPending: todoUpdating,} = useMutation({
    mutationFn: userTodoUpdateById,
    onSuccess: (results) => {
      if (results.success) {
        invalidate("todos")
        toast.success("Todo has been updated!!", {id: "update-todo",});
      } else {
        toast.error(results.error, {id: "update-todo",});
      }
    },
    onError: (error) => {
      toast.error(error.message, {id: "update-todo",});
    },
  });

  const onTodoUpdate = useCallback(
    (values: UserTodoSchemaType) => {
      toast.loading("Updating Todo...", {id: "update-todo",});
      todoUpdateMutate(values);
    },
    [todoUpdateMutate]
  );

  return {
    onTodoInsert,
    todoInserting,
    onTodoUpdate,
    todoUpdating,
  };
};
