"use client";
import { FilePenLine, MoreVertical, RefreshCcw, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PipeLine } from "@prisma/client";

type ActionProps = {
  pipeline: PipeLine;
  sendPipeline: (e: PipeLine, type: string) => void;
  onReset: () => void;
};

export const Actions = ({ pipeline, sendPipeline, onReset }: ActionProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
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
            onClick={() => sendPipeline(pipeline, "dialog")}
          >
            <FilePenLine size={16} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => sendPipeline(pipeline, "alert")}
          >
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
