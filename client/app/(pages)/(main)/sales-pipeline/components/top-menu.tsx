"use client";
import { Cog, RefreshCcw } from "lucide-react";
import { useModal } from "@/providers/modal";
import { useInvalidate } from "@/hooks/use-invalidate";

import { Button } from "@/components/ui/button";
import CreatePipelineDialog from "./create-pipeline-dialog";
import CustomModal from "@/components/global/custom-modal";
import { StageList } from "./stage-list";

export const TopMenu = () => {
  const { invalidate } = useInvalidate();
  const { setOpen } = useModal();

  return (
    <div className="flex gap-2 ml-auto mr-2 p-1 lg:mr-0">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => invalidate("pipelines")}
      >
        <RefreshCcw size={16} />
      </Button>

      <CreatePipelineDialog />
      {/* <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormOpen("insert")}
      >
        Add stage
      </Button> */}

      <Button
        variant="secondary"
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
