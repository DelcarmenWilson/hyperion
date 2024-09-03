"use client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusSelectProps = {
  status: string | undefined;
  setStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const StatusSelect = ({ status, setStatus }: StatusSelectProps) => {
  return (
    <Select name="ddlStatus" onValueChange={setStatus} defaultValue={status}>
      <SelectTrigger>
        <SelectValue placeholder="Select an agent" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <SelectItem value="ACTIVE">active</SelectItem>
        <SelectItem value="PAUSED">paused</SelectItem>
      </SelectContent>
    </Select>
  );
};
