"use client";
import { Briefcase, Plus } from "lucide-react";
import { useJobActions, useJobData, useJobStore } from "../hooks/use-jobs";

import { PageLayout } from "@/components/custom/layout/page";
import { PrevNextMenu } from "@/components/reusable/prev-next-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { JobForm } from "../components/form";
import { Button } from "@/components/ui/button";
import { MiniJobFormDrawer } from "./components/mini-form";

const JobPage = () => {
  const { job, isFetchingJob, jobPrevNext, isFetchingJobPrevNext } =
    useJobData();

  const { onJobUpdate, jobUpdateIsPending } = useJobActions();
  const { onMiniJobFormOpen } = useJobStore();

  return (
    <PageLayout
      title={`Job - ${job?.headLine} | Status:${job?.status}`}
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
              <JobForm
                job={job!}
                submit={onJobUpdate}
                loading={jobUpdateIsPending}
              />
            </SkeletonWrapper>
          </div>
          <div>
            <Button onClick={onMiniJobFormOpen}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </>
    </PageLayout>
  );
};

export default JobPage;
