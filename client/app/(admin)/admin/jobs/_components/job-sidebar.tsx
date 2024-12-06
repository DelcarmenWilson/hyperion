"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMiniJobId } from "@/hooks/job/use-mini-job";

import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MiniJob } from "@prisma/client";
import { EmptyCard } from "@/components/reusable/empty-card";
import CreateMiniJobDialog from "./create-mini-job-dialog";
import { JobStatus } from "@/types/job";
import { CheckCheck } from "lucide-react";

const JobSidebar = ({
  miniJobs,
  jobStatus,
}: {
  miniJobs: MiniJob[];
  jobStatus: string;
}) => {
  const { miniJobId } = useMiniJobId();
  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] border-r-2 border h-full p-2 px-4 overflow-hidden bg-background">
      <div className="flex justify-between items-center mb-1">
        <p className="font-semibold">Mini Jobs</p>

        {jobStatus == JobStatus.OPEN && <CreateMiniJobDialog />}
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
            status={job.status}
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
  status,
}: {
  jobId: string;
  id: string;
  name: string;
  selected: boolean;
  status: string;
}) => {
  return (
    <Link
      href={`/admin/jobs/${jobId}/${id}`}
      className={cn(
        buttonVariants({
          // variant: {selected?"default":"link"},
          variant: selected ? "default" : "ghost",
        }),
        "relative w-full capitalize justify-start mb-1"
      )}
    >
      <p className="text-ellipsis line-clamp-2 w-full">{name}</p>
      {status == JobStatus.COMPLETED && (
        <span className="absolute top-1/2 -translate-y-1/2 left-0 stroke-background">
          <CheckCheck size={15} />
        </span>
      )}
    </Link>
  );
};

export default JobSidebar;
