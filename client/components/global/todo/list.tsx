import React from "react";

import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HyperionColors } from "@/lib/colors";

import { UserTodo, UserTodoCategory } from "@prisma/client";

import { AddTodoBtn } from "./add-btn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EmptyCard } from "@/components/reusable/empty-card";
import { LoadingCard } from "@/components/reusable/loading-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TodoCard } from "./card";

const catergoryColors = {
  [HyperionColors.INDIGO]: "from-indigo-500 to-indigo-500/20",
  [HyperionColors.GRAY]: "from-gray-500 to-gray-500/20",
  [HyperionColors.GREEN]: "from-green-500 to-green-500/20",
  [HyperionColors.BLUE]: "from-blue-500 to-blue-500/20",
  [HyperionColors.RED]: "from-red-500 to-red-500/20",
  [HyperionColors.PURPLE]: "from-purple-500 to-purple-500/20",
  [HyperionColors.PRIMARY]: "from-primary to-primary/20",
};

export const TodosList = ({
  categories,
  todos,
  loading,
}: {
  categories: UserTodoCategory[];
  todos: UserTodo[];
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
        {categories.map((category) => (
          <Collapsible key={category.id} defaultOpen={true}>
            <CollapsibleTrigger
              className={cn(
                "w-full flex justify-between item-center p-2 border rounded-t text-sm bg-gradient-to-tr",
                catergoryColors[category.color as HyperionColors]
              )}
            >
              {category.name}
              <ChevronsUpDown size={16} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 py-2">
              {todos
                .filter((e) => e.categoryId == category.id)
                .map((todo) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
};
