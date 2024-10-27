"use client";
import { Briefcase } from "lucide-react";
import { useJobActions, useJobData } from "../hooks/use-job";

import { JobForm } from "../components/form";
import { MiniJobFormDrawer } from "./components/mini-job/form";
import { PageLayout } from "@/components/custom/layout/page";
import { PrevNextMenu } from "@/components/reusable/prev-next-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import MiniJobClient from "./components/mini-job/client";

const JobPage = () => {
  const { job, isFetchingJob, jobPrevNext, isFetchingJobPrevNext } =
    useJobData();
  const { onJobUpdate, jobUpdating } = useJobActions();

  return (
    <PageLayout
      title={`Job - ${job?.headLine} | status:${job?.status}`}
      icon={Briefcase}
      topMenu={
        <SkeletonWrapper isLoading={isFetchingJobPrevNext}>
          <PrevNextMenu
            href="admin/jobs"
            prevNext={jobPrevNext!}
            btnText="job"
          />
        </SkeletonWrapper>
      }
    >
      <>
        <MiniJobFormDrawer />
        <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
          <div className="border-e">
            <SkeletonWrapper isLoading={isFetchingJob}>
              <JobForm job={job!} submit={onJobUpdate} loading={jobUpdating} />
            </SkeletonWrapper>
          </div>
          <MiniJobClient />
        </div>
      </>
    </PageLayout>
  );
};

export default JobPage;
