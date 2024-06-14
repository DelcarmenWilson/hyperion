"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { Switch } from "@/components/ui/switch";
import { TaskForm } from "./form";

import { taskDeleteById, taskUpdateByIdPublished } from "@/actions/task";
import { formatDate } from "@/formulas/dates";

type TaskCardProps = {
  initTask: Task;
  onTaskDeleted: (e: string) => void;
};

export const TaskCard = ({ initTask, onTaskDeleted }: TaskCardProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState(initTask);
  const [published, setPublished] = useState(initTask.published);

  const onTaskUpdated = (e?: Task) => {
    if (e) setTask(e);
    setIsOpen(false);
  };

  const onDeleteTask = async () => {
    setLoading(true);
    const deletedTask = await taskDeleteById(task.id);

    if (deletedTask.success) {
      onTaskDeleted(task.id);
      toast.success(deletedTask.success);
    } else toast.error(deletedTask.error);

    setAlertOpen(false);
    setLoading(false);
  };

  const onTaskPublished = async (e: boolean) => {
    setPublished(e);

    setLoading(true);
    const updatedTask = await taskUpdateByIdPublished(task.id, e);
    if (updatedTask.success) {
      toast.success(updatedTask.success);
    } else toast.error(updatedTask.error);

    setLoading(false);
  };

  return (
    <>
      <AlertModal
        title="Want to delete this task"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteTask}
        loading={loading}
        height="h-200"
      />
      <DrawerRight
        title="Edit Task"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <TaskForm task={task} onClose={onTaskUpdated} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${task.headLine}`}</h3>
        <div className="flex justify-end gap-2">
          <p className="font-semibold">Published:</p>
          <Switch
            name="cblPublished"
            disabled={loading}
            checked={published}
            onCheckedChange={onTaskPublished}
          />
        </div>
        <CardData label="Status" value={task.status} />

        <CardData label="Description" value={task.description} column />
        <CardData label="Start Date" value={formatDate(task.startAt)} />
        <CardData label="End Date" value={formatDate(task.endAt)} />

        <div className="flex group gap-2 justify-end items-center  mt-auto pt-2 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/tasks/${task.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
