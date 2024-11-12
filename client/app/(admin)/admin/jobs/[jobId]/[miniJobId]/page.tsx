import React from "react";

import { EmptyCard } from "@/components/reusable/empty-card";
import MiniJobInfo from "./_components/info";
import { getMiniJob } from "@/actions/developer/mini-job/get-mini-job";

const MiniJobPage = async ({ params }: { params: { miniJobId: string } }) => {
  const { miniJobId } = params;

  const miniJob = await getMiniJob(miniJobId);

  if (!miniJob) return <EmptyCard title="Mini Job not found!" />;

  return <MiniJobInfo miniJob={miniJob} />;
};

export default MiniJobPage;
