"use client";
import { useEffect } from "react";
import { Reorder } from "framer-motion";
import { usePipelineStore } from "@/stores/pipeline-store";
import { usePipelineData } from "@/hooks/pipeline/use-pipeline";

import { EmptyCard } from "@/components/reusable/empty-card";
import { PipelineCard } from "./card";

export const PipeLineList = () => {
  const { loaded, setPipelines, pipelines, leads, initialSetUp } =
    usePipelineStore();

  const { onGetPipelinesAndLeads } = usePipelineData();
  const { pipelinesAndLeads, pipelinesAndLeadsFetching } =
    onGetPipelinesAndLeads();

  useEffect(() => {
    if (loaded) return;
    if (!pipelinesAndLeads) return;
    initialSetUp(pipelinesAndLeads.pipelines, pipelinesAndLeads.leads);
  }, [loaded, pipelinesAndLeads]);

  return (
    <>
      {!pipelines && !pipelinesAndLeadsFetching && (
        <EmptyCard
          title="No Stages Available"
          subTitle="Please add a new stage"
        />
      )}
      {pipelines && (
        <Reorder.Group values={pipelines} onReorder={setPipelines}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {pipelines?.map((pipeline, index) => (
              <PipelineCard
                key={pipeline.id}
                idx={index}
                pipeline={pipeline}
                loading={pipelinesAndLeadsFetching}
                initLeads={leads!.filter(
                  (e) => e.statusId == pipeline.statusId
                )}
              />
            ))}
          </div>
        </Reorder.Group>
      )}
    </>
  );
};
