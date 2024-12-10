"use client";
import { MoreVertical, RefreshCcw } from "lucide-react";

import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";

import { Pipeline } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/custom/delete-dialog";
import UpdatePipelineDialog from "./update-pipeline-dialog";

type Props = {
  pipeline: Pipeline;
  onReset: () => void;
};

export const Actions = ({ pipeline, onReset }: Props) => {
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
