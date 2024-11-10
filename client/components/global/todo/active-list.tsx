import React from "react";
import { useTodoData } from "@/hooks/user/use-todo";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TodoCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { AddTodoBtn } from "./add-btn";

export const TodoActiveList = () => {
  const { onTodosGet } = useTodoData();
  const { todos, todosFetching } = onTodosGet();
  if (todos?.length == 0 && !todosFetching)
    return (
      <EmptyCard
        title="You are all cuaght up"
        subTitle={<AddTodoBtn text="New Task" />}
      />
    );
  return (
    <SkeletonWrapper isLoading={todosFetching}>
      <div className="flex flex-col gap-2 py-2">
        {todos?.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
