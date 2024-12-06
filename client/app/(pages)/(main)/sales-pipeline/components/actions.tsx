"use client";
import { FilePenLine, MoreVertical, RefreshCcw, Trash } from "lucide-react";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";

import { Pipeline } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdatePipelineDialog from "./update-pipeline-dialog";
import DeleteDialog from "@/components/custom/delete-dialog";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";

type Props = {
  pipeline: Pipeline;
  onReset: () => void;
};

export const Actions = ({ pipeline, onReset }: Props) => {
  const { onFormOpen, onAlertOpen } = usePipelineStore();
  const { onDeletePipeline, pipelineDeleting } = usePipelineActions();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" variant="transparent" size="icon">
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="center">
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="px-4 gap-2 w-full justify-start"
            onClick={onReset}
          >
            <RefreshCcw size={16} />
            Reset
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <UpdatePipelineDialog pipeline={pipeline} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteDialog
            title="stage"
            btnClass="justify-start"
            cfText={pipeline.name}
            onConfirm={() => onDeletePipeline(pipeline.id)}
            loading={pipelineDeleting}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
