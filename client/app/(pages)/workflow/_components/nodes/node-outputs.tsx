import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { TaskParam } from "@/types/workflow/task";
import { colorForHandle } from "./common";

export const NodeOutputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
};

export const NodeOutput = ({ output }: { output: TaskParam }) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary w-full">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
          colorForHandle[output.type]
        )}
      />
    </div>
  );
};
