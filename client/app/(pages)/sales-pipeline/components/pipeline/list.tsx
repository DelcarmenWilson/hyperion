import { Reorder } from "framer-motion";

import { FullLead, FullPipeline } from "@/types";

import { AlertModal } from "@/components/modals/alert";

import { PipelineCard } from "./card";
import {
  usePipelineActions,
  usePipelineStore,
} from "../../hooks/use-pipelines";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type PipeLineListProps = {
  leads: FullLead[];
  initPipelines: FullPipeline[];
  loading: boolean;
};
export const PipeLineList = ({
  leads,
  initPipelines,
  loading,
}: PipeLineListProps) => {
  const {
    pipelines,
    setPipelines,
    onPipelineDeleteSubmit,
    isPendingPipelineDelete,
  } = usePipelineActions(initPipelines);
  const { isAlertOpen, onAlertClose, pipelineId } = usePipelineStore();

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onConfirm={() => onPipelineDeleteSubmit(pipelineId!)}
        loading={isPendingPipelineDelete}
        height="h-auto"
      />

      <Reorder.Group values={pipelines} onReorder={setPipelines}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pipelines?.map((pipeline, index) => (
            <SkeletonWrapper key={pipeline.id} isLoading={loading}>
              <PipelineCard
                idx={index}
                pipeline={pipeline}
                initLeads={leads.filter(
                  (e) => e.status == pipeline.status.status
                )}
              />
            </SkeletonWrapper>
          ))}
        </div>
      </Reorder.Group>
    </>
  );
};
