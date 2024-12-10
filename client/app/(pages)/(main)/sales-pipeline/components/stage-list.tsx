"use client";
import { FullPipeline } from "@/types";
import { RefreshCcw } from "lucide-react";
import { Reorder } from "framer-motion";
import { usePipelineStore } from "@/stores/pipeline-store";
import { usePipelineStageActions } from "@/hooks/pipeline/use-pipeline";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const StageList = () => {
  const { pipelines } = usePipelineStore();
  const {
    buttonEnabled,
    stages,
    onStageUpdate,
    onReorder,
    onReset,
    pipelineOrderUpdating,
  } = usePipelineStageActions(pipelines!);

  if (!stages) return null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground border-b items-center">
        <p>Status</p>
        <p>Title</p>
        <p className="text-end">Created at</p>
      </div>
      <Reorder.Group values={stages} onReorder={onReorder}>
        <ul>
          {stages.map((stage) => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </ul>
      </Reorder.Group>

      {buttonEnabled && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            className="gap-2"
            disabled={pipelineOrderUpdating}
            variant="ghost"
            onClick={onReset}
          >
            <RefreshCcw size={16} />
            Reset
          </Button>
          <Button disabled={pipelineOrderUpdating} onClick={onStageUpdate}>
            Update
          </Button>
        </div>
      )}
    </div>
  );
};

type StageCardProps = {
  stage: FullPipeline;
};

export const StageCard = ({ stage }: StageCardProps) => {
  return (
    <Reorder.Item value={stage}>
      <li className="grid grid-cols-3 p-2 text-sm border-b items-center hover:bg-secondary hover:text-[0.85rem] cursor-move">
        <p>{stage.status.status}</p>
        <p>{stage.name}</p>
        <p className="text-end">{formatDate(stage.createdAt)}</p>
      </li>
    </Reorder.Item>
  );
};
