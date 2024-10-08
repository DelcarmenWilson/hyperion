"use client";
import { FilePenLine, MoreVertical, RefreshCcw, Trash } from "lucide-react";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  pipelineId: string;
  onReset: () => void;
};

export const Actions = ({ pipelineId, onReset }: Props) => {
  const { onFormOpen, onAlertOpen } = usePipelineStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" variant="transparent" size="icon">
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="center">
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2" onClick={onReset}>
          <RefreshCcw size={16} />
          Reset
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => onFormOpen("edit", pipelineId)}
        >
          <FilePenLine size={16} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => onAlertOpen(pipelineId)}
        >
          <Trash size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
