"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/constants/states";

type Props = {
  state: string;
  onSetState: (c: "state", e: string) => void;
  filter?: boolean;
};

export const LeadStateSelect = ({
  state,
  onSetState,
  filter = false,
}: Props) => {
  return (
    <Select
      name="ddlState"
      onValueChange={(e) => onSetState("state", e)}
      defaultValue={state}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select State" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {filter && <SelectItem value="%">All</SelectItem>}
        {states.map((state) => (
          <SelectItem key={state.state} value={state.abv}>
            {state.state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
