import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/workflow/app-node";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useId, useState } from "react";

const StringParam = ({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  let Component: any = Input;
  if (param.variant == "textarea") {
    Component = Textarea;
  }
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        id={id}
        value={internalValue}
        disabled={disabled}
        className="text-xs"
        placeholder="Enter value here"
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;