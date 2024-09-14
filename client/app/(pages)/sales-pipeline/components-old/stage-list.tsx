"use client";
import { useState } from "react";
import { FullPipeline } from "@/types";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/modal";

import { toast } from "sonner";
import { Reorder } from "framer-motion";

import { Button } from "@/components/ui/button";

import { pipelineUpdateOrder } from "@/actions/pipeline";
import { formatDate } from "@/formulas/dates";

export const StageList = ({ pipelines }: { pipelines: FullPipeline[] }) => {
  const { setClose } = useModal();
  const router = useRouter();
  const [stages, setStages] = useState(pipelines);
  const [loading, setLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const onStageUpdate = async () => {
    const list: { id: string; order: number }[] = stages.map(
      (stage, index) => ({
        id: stage.id,
        order: index,
      })
    );
    setLoading(true);
    const updatePipeline = await pipelineUpdateOrder(list);
    if (updatePipeline.success) {
      toast.success(updatePipeline.success);
      setButtonEnabled(false);
      router.refresh();
      setClose();
    } else toast.error(updatePipeline.error);

    setLoading(false);
  };

  const onReorder = (e: FullPipeline[]) => {
    setStages(e);
    setButtonEnabled(true);
  };

  const onReset = () => {
    setButtonEnabled(false);
    setStages(pipelines);
  };

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
            disabled={loading}
            variant="ghost"
            onClick={onReset}
          >
            <RefreshCcw size={16} />
            Reset
          </Button>
          <Button disabled={loading} onClick={onStageUpdate}>
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
