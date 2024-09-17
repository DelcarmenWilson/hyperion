"use client";
import { UserSquare } from "lucide-react";
import { usePipelineData } from "./hooks/use-pipelines";

import { PageLayout } from "@/components/custom/layout/page";
import { TopMenu } from "./components/top-menu";

import { EmptyCard } from "@/components/reusable/empty-card";
import { PipeLineList } from "./components/pipeline/list";
import { PipelineForm } from "./components/pipeline/form";

const SalesPage = () => {
  const { pipelines, isFetchingPipelines, leads } = usePipelineData();

  return (
    <PageLayout title="Sales Pipeline" icon={UserSquare} topMenu={<TopMenu />}>
      {pipelines && pipelines.length > 0 ? (
        <PipeLineList
          leads={leads!}
          initPipelines={pipelines!}
          loading={isFetchingPipelines}
        />
      ) : (
        <EmptyCard
          title="No Stages Available"
          subTitle="Please add a new stage"
        />
      )}
      <PipelineForm />
    </PageLayout>
  );
};

export default SalesPage;
