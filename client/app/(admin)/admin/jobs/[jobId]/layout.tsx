import React, { ReactNode } from "react";
import { currentUser } from "@/lib/auth";

import { EmptyCard } from "@/components/reusable/empty-card";
import JobSidebar from "../_components/job-sidebar";
import Topbar from "../_components/top-bar";
import Unauthenticated from "@/components/global/unauthenticated";

import { getJob } from "@/actions/developer/job";
import { getMiniJobsForJob } from "@/actions/developer/mini-job";

const JobLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { jobId: string };
}) => {
  const user = currentUser();
  const { jobId } = params;
  if (!user) return <Unauthenticated />;

  const job = await getJob(jobId);

  if (!job) return <EmptyCard title="Jobs not found!" />;
  const miniJobs = await getMiniJobsForJob(job.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar job={job} />
      <section className="flex h-full overflow-auto">
        <JobSidebar miniJobs={miniJobs} jobStatus={job.status} />
        <div className="flex flex-col flex-1 bg-background p-2">{children}</div>
      </section>
    </div>
  );
};
export default JobLayout;
