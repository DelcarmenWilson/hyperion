"use client";
import { TaskLists, TaskType } from "@/types/workflow/task";
import { TaskRegistry } from "@/lib/workflow/task/registry";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import NodeSidebar from "./sidebar/node-sidebar";

const TaskMenu = () => {
  return (
    <aside className="relative w-[340px] min-w-[340px] max-w-[340px] border-r-2 border h-full p-2 px-4 overflow-auto">
      <NodeSidebar />
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        {TaskLists.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="font-bold">
              {item.name}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {item.tasks.map((task) => (
                <TaskMenuBtn key={task} taskType={task as TaskType} />
              ))}
              {/* <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} /> */}
            </AccordionContent>
          </AccordionItem>
        ))}
        {/* <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            {data.map((type) => (
              <TaskMenuBtn key={type} taskType={type} />
            ))}
            {/* <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} /> 
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
    </aside>
  );
};

const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];
  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant="secondary"
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
};

export default TaskMenu;
