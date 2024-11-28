import React from "react";
import { TodoCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { AddTodoBtn } from "./add-btn";
import { UserTodo } from "@prisma/client";
import { LoadingCard } from "@/components/reusable/loading-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TodosList = ({
  todos,
  loading,
}: {
  todos: UserTodo[] | [];
  loading: boolean;
}) => {
  if (loading) return <LoadingCard />;
  if (todos?.length == 0 && !loading)
    return (
      <EmptyCard
        title="You are all caught up"
        subTitle={<AddTodoBtn text="New Task" />}
      />
    );
  return (
    <ScrollArea>
      <div className="flex flex-col gap-2 py-2 h-full overflow-hidden">
        {todos?.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </ScrollArea>
  );
};
