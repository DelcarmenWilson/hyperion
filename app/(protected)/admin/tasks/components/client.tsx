"use client";
import { useState } from "react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Task } from "@prisma/client";

import { TaskForm } from "./form";
import { columns } from "./columns";
import { TaskList } from "./list";
import { TopMenu } from "./top-menu";

type TaskClientProps = {
  initTasks: Task[];
};

export const TaskClient = ({ initTasks }: TaskClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);
  const [tasks, setTasks] = useState(initTasks);
  const onTaskCreated = (e?: Task) => {
    if (e) {
      setTasks((tasks) => {
        return [...tasks, e];
      });
    }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Task"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <TaskForm onClose={onTaskCreated} />
      </DrawerRight>
      {isList ? (
        <DataTable
          columns={columns}
          data={tasks}
          headers
          topMenu={
            <TopMenu
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      ) : (
        <>
          <div className="p-2">
            <TopMenu
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
            />
          </div>
          <TaskList initTasks={tasks} />
        </>
      )}
    </>
  );
};
