"use client";
import { UserSquare } from "lucide-react";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";
import { usePipelineData } from "@/hooks/pipeline/use-pipeline";

import { PageLayout } from "@/components/custom/layout/page";
import { TopMenu } from "./components/top-menu";

import { EmptyCard } from "@/components/reusable/empty-card";
import { PipeLineList } from "./components/pipeline/list";
import { PipelineForm } from "./components/pipeline/form";

const SalesPage = () => {
  const { isFetchingPipelineAndLeads } = usePipelineData();
  const { pipelines } = usePipelineStore();
  return (
    <PageLayout title="Sales Pipeline" icon={UserSquare} topMenu={<TopMenu />}>
      {!pipelines ? (
        <EmptyCard
          title="No Stages Available"
          subTitle="Please add a new stage"
        />
      ) : (
        <PipeLineList loading={isFetchingPipelineAndLeads} />
      )}
      <PipelineForm />
    </PageLayout>
  );
};

export default SalesPage;
