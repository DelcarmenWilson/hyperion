import React, { Suspense } from "react";
import { BriefcaseIcon } from "lucide-react";

import AlertError from "@/components/custom/alert-error";
import CreateJobDialog from "./_components/create-job-dialog";
import JobCard from "./_components/job-card";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import NewPageLayout from "@/components/custom/layout/new-page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobs } from "@/actions/developer/job";

const JobsPage = () => {
  return (
    <NewPageLayout
      title="Jobs"
      subTitle="Manage All Jobs"
      topMenu={<CreateJobDialog />}
    >
      <Suspense fallback={<JobsSkeleton />}>
        <Jobs />
      </Suspense>
    </NewPageLayout>
  );
};

const JobsSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const Jobs = async () => {
  const jobs = await getJobs();
  if (!jobs) return <AlertError />;
  if (jobs.length === 0)
    return (
      <NewEmptyCard
        title="No jobs created yet"
        subTitle="Click the button below to create your first job"
        icon={BriefcaseIcon}
        button={<CreateJobDialog triggerText="Create your first job" />}
      />
    );

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobsPage;
