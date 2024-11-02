"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";

import { DrawerRight } from "@/components/custom/drawer/right";
import { DataTable } from "@/components/tables/data-table";
import { Task } from "@prisma/client";

import { TaskForm } from "./form";
import { columns } from "./columns";
import { TaskList } from "./list";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { TopMenu } from "@/components/callhistory/top-menu";

type TaskClientProps = {
  initTasks: Task[];
};

export const TaskClient = ({ initTasks }: TaskClientProps) => {
  const user = useCurrentUser();
  const [tasks, setTasks] = useState(initTasks);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="New Task"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
    />
  );
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
        title="New Task"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <TaskForm onClose={onTaskCreated} />
      </DrawerRight>
      {isList ? (
        <DataTable columns={columns} data={tasks} headers topMenu={topMenu} />
      ) : (
        <>
          <div className="p-2">{topMenu}</div>
          <TaskList initTasks={tasks} />
        </>
      )}
    </>
  );
};
