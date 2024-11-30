"use client";
import { useTodoData } from "@/hooks/user/use-todo";

import { TodoStatus } from "@/types/todo";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodosList } from "./list";
import { useTodoCategoryData } from "@/hooks/user/use-todo-category";

const TodoShell = () => {
  const { onTodosGet } = useTodoData();
  const { todos, todosFetching } = onTodosGet();
  const { onGetCategories } = useTodoCategoryData();
  const { categories } = onGetCategories();
  if (todos == undefined || categories == undefined) return null;
  return (
    <div className="flex flex-1 border-t h-full overflow-hidden">
      <Tabs className="flex flex-col w-full h-full" defaultValue="active">
        <TabsList className="w-full h-auto bg-primary/25">
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2"
            value="active"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-1 py-1"
            value="completed"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="active"
          >
            <TodosList
              categories={categories}
              todos={todos.filter((e) => e.status == TodoStatus.PENDING)}
              loading={todosFetching}
            />
          </TabsContent>

          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="completed"
          >
            <TodosList
              categories={categories}
              todos={todos.filter((e) => e.status == TodoStatus.COMPLETED)}
              loading={todosFetching}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TodoShell;
