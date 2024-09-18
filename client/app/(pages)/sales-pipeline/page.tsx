"use client";
import { UserSquare } from "lucide-react";
import { usePipelineData } from "./hooks/use-pipelines";

import { PageLayout } from "@/components/custom/layout/page";
import { TopMenu } from "./components/top-menu";

import { EmptyCard } from "@/components/reusable/empty-card";
import { PipeLineList } from "./components/pipeline/list";
import { PipelineForm } from "./components/pipeline/form";

const SalesPage = () => {
  const { pipelineAndLeads, isFetchingPipelineAndLeads } = usePipelineData();

  return (
    <PageLayout title="Sales Pipeline" icon={UserSquare} topMenu={<TopMenu />}>
      {!pipelineAndLeads?.pipelines ? (
        <EmptyCard
          title="No Stages Available"
          subTitle="Please add a new stage"
        />
      ) : (
        <PipeLineList
          pipelineAndLeads={pipelineAndLeads}
          loading={isFetchingPipelineAndLeads}
        />
      )}
      <PipelineForm />
    </PageLayout>
  );
};

export default SalesPage;
