"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMiniJobId } from "@/hooks/job/use-mini-job";

import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MiniJob } from "@prisma/client";
import { EmptyCard } from "@/components/reusable/empty-card";
import CreateMiniJobDialog from "./create-mini-job-dialog";

const JobMenu = ({ miniJobs }: { miniJobs: MiniJob[] }) => {
  const { miniJobId } = useMiniJobId();
  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] border-r-2 border h-full p-2 px-4 overflow-hidden bg-background">
      <div className="flex justify-between items-center mb-1">
        <p className="font-semibold">Mini Jobs</p>
        <CreateMiniJobDialog />
      </div>
      <ScrollArea>
        {miniJobs.length == 0 && (
          <EmptyCard
            title="No mini jobs found"
            subTitle={<CreateMiniJobDialog triggerText="Create Mini Job" />}
          />
        )}
        {miniJobs.map((job) => (
          <TaskMenuBtn
            key={job.id}
            jobId={job.jobId}
            id={job.id}
            name={job.name}
            selected={job.id == miniJobId}
          />
        ))}
      </ScrollArea>
    </aside>
  );
};

const TaskMenuBtn = ({
  jobId,
  id,
  name,
  selected,
}: {
  jobId: string;
  id: string;
  name: string;
  selected: boolean;
}) => {
  return (
    <Link
      href={`/admin/jobs/${jobId}/${id}`}
      className={cn(
        buttonVariants({
          // variant: {selected?"default":"link"},
          variant: selected ? "default" : "ghost",
        }),
        "w-full capitalize justify-start"
      )}
    >
      {name}
    </Link>
  );
};

export default JobMenu;
