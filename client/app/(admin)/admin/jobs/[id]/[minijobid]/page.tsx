"use client";
import { Briefcase } from "lucide-react";
import { useMiniJobActions, useMiniJobData } from "../../hooks/use-mini-job";

import { JobForm } from "../components/form";
import { PageLayout } from "@/components/custom/layout/page";
import { PrevNextMenu } from "@/components/reusable/prev-next-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { MiniJobForm } from "../components/mini-job/form";
// import MiniJobClient from "./components/mini-job/client";

const MiniJobPage = () => {
  const {
    miniJob,
    isFetchingMiniJob,
    miniJobPrevNext,
    isFetchingMiniJobPrevNext,
  } = useMiniJobData();
  const { onMiniJobUpdate, miniJobUpdating } = useMiniJobActions();

  return (
    <PageLayout
      title={`Job - ${miniJob?.name} | status:${miniJob?.status}`}
      icon={Briefcase}
      topMenu={
        <SkeletonWrapper isLoading={isFetchingMiniJobPrevNext}>
          <PrevNextMenu
            href={`admin/jobs/${miniJob?.jobId}`}
            prevNext={miniJobPrevNext!}
            btnText="mini Job"
          />
        </SkeletonWrapper>
      }
    >
      <>
        <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
          <div className="border-e">
            <SkeletonWrapper isLoading={isFetchingMiniJob}>
              <MiniJobForm
                job={miniJob!}
                submit={onMiniJobUpdate}
                loading={miniJobUpdating}
              />
            </SkeletonWrapper>
          </div>
          {/* <MiniJobClient /> */}
        </div>
      </>
    </PageLayout>
  );
};

export default MiniJobPage;
