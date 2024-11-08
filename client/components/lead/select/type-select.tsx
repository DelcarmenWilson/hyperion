"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadUpdateByIdType } from "@/actions/lead";
import { toast } from "sonner";
import { allLeadTypes } from "@/constants/lead";

type Props = {
  id: string;
  type: string;
  onChange?: (e: string) => void;
};

export const LeadTypeSelect = ({ id, type, onChange }: Props) => {
  const onTypeUpdated = async (newType: string) => {
    if (newType == type) return;
    if (onChange) onChange(type);
    else {
      const updatedType = await leadUpdateByIdType(id, newType);
      if (updatedType.success) toast.success(updatedType.success);
      else toast.error(updatedType.error);
    }
  };
  return (
    <Select
      name="ddlLeadType"
      onValueChange={onTypeUpdated}
      defaultValue={type}
    >
      <SelectTrigger className="bg-background">
        <SelectValue placeholder="Select Lead Type" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {allLeadTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
