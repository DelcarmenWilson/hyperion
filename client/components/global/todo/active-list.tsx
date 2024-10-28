import React from "react";
import { useTodoData } from "@/hooks/user/use-todo";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TodoCard } from "./card";

export const TodoActiveList = () => {
  const { todos, isFetchingTodo } = useTodoData();
  return (
    <SkeletonWrapper isLoading={isFetchingTodo}>
      <div className="flex flex-col gap-2 py-2">
        {todos?.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
