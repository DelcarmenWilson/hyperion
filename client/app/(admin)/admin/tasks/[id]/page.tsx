import { ListTodo } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";

import { taskGetById, taskGetPrevNextById } from "@/data/task";
import { TaskIdForm } from "./components/form";
import { PrevNextMenu } from "@/components/reusable/prev-next-menu";

const TaskIdPage = async ({ params }: { params: { id: string } }) => {
  const task = await taskGetById(params.id);
  const prevNext = await taskGetPrevNextById(params.id);
  if (!task) return null;
  return (
    <PageLayout
      title={`Task - ${task.headLine} | Status:${task.status}`}
      icon={ListTodo}
      topMenu={
        <PrevNextMenu href="admin/tasks" prevNext={prevNext} btnText="task" />
      }
    >
      <TaskIdForm task={task} />
    </PageLayout>
  );
};

export default TaskIdPage;
