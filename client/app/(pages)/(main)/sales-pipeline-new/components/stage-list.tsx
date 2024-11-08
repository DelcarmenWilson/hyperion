"use client";
import { useState } from "react";
import { FullPipeline } from "@/types";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/modal";

import { toast } from "sonner";
import { Reorder } from "framer-motion";

import { Button } from "@/components/ui/button";

import { pipelineUpdateOrder } from "@/actions/user/pipeline";
import { formatDate } from "@/formulas/dates";
import {
  usePipelineData,
  usePipelineStageActions,
} from "../hooks/use-pipelines";

export const StageList = ({ pipelines }: { pipelines: FullPipeline[] }) => {
  const {
    buttonEnabled,
    stages,
    onStageUpdate,
    onReorder,
    onReset,
    isPendingPipelineUpdateOrder,
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
            disabled={isPendingPipelineUpdateOrder}
            variant="ghost"
            onClick={onReset}
          >
            <RefreshCcw size={16} />
            Reset
          </Button>
          <Button
            disabled={isPendingPipelineUpdateOrder}
            onClick={onStageUpdate}
          >
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
