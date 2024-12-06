import { Reorder } from "framer-motion";
import { AlertModal } from "@/components/modals/alert";

import { PipelineCard } from "./card";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";

type Props = {
  loading: boolean;
};
export const PipeLineList = ({ loading }: Props) => {
  const {
    isAlertOpen,
    onAlertClose,
    pipelineId,
    setPipelines,
    pipelines,
    leads,
  } = usePipelineStore();
  const { onDeletePipeline, pipelineDeleting } = usePipelineActions();

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onConfirm={() => onDeletePipeline(pipelineId!)}
        loading={pipelineDeleting}
        height="h-auto"
      />

      {pipelines && (
        <Reorder.Group values={pipelines} onReorder={setPipelines}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {pipelines?.map((pipeline, index) => (
              <PipelineCard
                key={pipeline.id}
                idx={index}
                pipeline={pipeline}
                loading={loading}
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
