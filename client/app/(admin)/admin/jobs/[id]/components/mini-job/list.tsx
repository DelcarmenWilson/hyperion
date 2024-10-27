import React from "react";
import { useMiniJobData } from "../../../hooks/use-mini-job";

import { MiniJobCard } from "./card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const MiniJobList = () => {
  const { miniJobs, isFetchingMiniJobs } = useMiniJobData();
  return (
    <SkeletonWrapper isLoading={isFetchingMiniJobs}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {miniJobs?.map((miniJob) => (
          <MiniJobCard key={miniJob.id} miniJob={miniJob} />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
