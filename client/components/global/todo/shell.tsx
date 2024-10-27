"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoActiveList } from "./active-list";

const TodoShell = () => {
  return (
    <div className="flex flex-1 border-t h-full overflow-hidden">
      <Tabs className="w-[400px] flex flex-col h-full" defaultValue="active">
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
            <TodoActiveList />
          </TabsContent>

          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="completed"
          >
            Here are the active todos
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TodoShell;
