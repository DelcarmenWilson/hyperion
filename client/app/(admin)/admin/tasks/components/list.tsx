"use client";
import React, { useState } from "react";
import { Task } from "@prisma/client";
import { TaskCard } from "./card";

type TaskListProps = {
  initTasks: Task[];
};
export const TaskList = ({ initTasks }: TaskListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initTasks);

  const onTaskInserted = (e: Task) => {
    setTasks((tasks) => [...tasks, e]);
    setIsOpen(false);
  };

  const onTaskDeleted = (id: string) => {
    setTasks((tasks) => tasks.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} initTask={task} onTaskDeleted={onTaskDeleted} />
      ))}
    </div>
  );
};
