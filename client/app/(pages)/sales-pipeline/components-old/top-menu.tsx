"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userEmitter } from "@/lib/event-emmiter";
import { Cog, RefreshCcw } from "lucide-react";
import { useModal } from "@/providers/modal";

import { FullPipeline } from "@/types";

import { Button } from "@/components/ui/button";

import CustomModal from "@/components/global/custom-modal";
import { PipelineForm } from "./form";
import { StageList } from "./stage-list";

export const TopMenu = ({ pipelines }: { pipelines: FullPipeline[] }) => {
  const { setOpen } = useModal();
  const router = useRouter();

  const onRefresh = () => {
    router.refresh();
  };

  useEffect(() => {
    userEmitter.on("leadStatusChanged", () => onRefresh());
  }, []);

  return (
    <div className="flex gap-2 ml-auto mr-6 lg:mr-0">
      <Button size="sm" onClick={onRefresh}>
        <RefreshCcw size={16} />
      </Button>

      <Button
        size="sm"
        onClick={() => {
          setOpen(
            <CustomModal title="Add Stage">
              <PipelineForm />
            </CustomModal>
          );
        }}
      >
        Add stage
      </Button>

      <Button
        size="sm"
        onClick={() =>
          setOpen(
            <CustomModal title="Organize Your Pipelines">
              <StageList pipelines={pipelines} />
            </CustomModal>
          )
        }
      >
        <Cog size={16} className="mr-2" /> Config
      </Button>
    </div>
  );
};
