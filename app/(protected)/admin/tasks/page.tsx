import Link from "next/link";
import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { Button } from "@/components/ui/button";
import { TaskClient } from "./components/client";
import { tasksGetAll } from "@/actions/task";

const TaskPage = async () => {
  const tasks = await tasksGetAll();

  return (
    <PageLayoutAdmin
      title="Tasks"
      description="Manage Hyperion Tasks"
      topMenu={
        <Button variant="outlineprimary" asChild>
          <Link href="/test" target="_blank">
            Landing page sample
          </Link>
        </Button>
      }
    >
      <TaskClient initTasks={tasks} />
    </PageLayoutAdmin>
  );
};

export default TaskPage;
