"use client";
import { Cog, RefreshCcw } from "lucide-react";
import { useModal } from "@/providers/modal";
import { usePipelineActions, usePipelineStore } from "../hooks/use-pipelines";

import { FullPipeline } from "@/types";

import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/custom-modal";
import { StageList } from "./stage-list";

export const TopMenu = () => {
  const { onFormOpen } = usePipelineStore();
  const { invalidate } = usePipelineActions([]);
  const { setOpen } = useModal();

  return (
    <div className="flex gap-2 ml-auto mr-6 lg:mr-0">
      <Button size="sm" onClick={() => invalidate(["pipelines"])}>
        <RefreshCcw size={16} />
      </Button>

      <Button size="sm" onClick={() => onFormOpen("insert")}>
        Add stage
      </Button>

      <Button
        size="sm"
        onClick={() =>
          setOpen(
            <CustomModal title="Organize Your Pipelines">
              <StageList />
            </CustomModal>
          )
        }
      >
        <Cog size={16} className="mr-2" /> Config
      </Button>
    </div>
  );
};
