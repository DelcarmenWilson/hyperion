import React, { useEffect, useId, useState } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";

import { ParamProps } from "@/types/workflow/app-node";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePipelineData } from "@/hooks/pipeline/use-pipeline";

const SelectPipelineParam = ({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) => {
  const { onSetReaload } = useWorkflowStore();
  const id = useId();
  const {onGetPipelines}= usePipelineData();
const{pipelines,pipelinesFetching,pieplinesLoading}=onGetPipelines()

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>

      <Select
        name={id}
        disabled={disabled}
        defaultValue={value}
        onValueChange={(e) => {
          updateNodeParamValue(e);
          onSetReaload(true);
        }}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={param.helperText} />
        </SelectTrigger>

        <SelectContent className="max-h-[250px]">
          {pipelines?.map(p=>(
            <SelectItem value={p.id} key={p.id}>
              {p.name}
            </SelectItem>
          ))}
          
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPipelineParam;
