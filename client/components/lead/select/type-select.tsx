"use client";
import React from "react";
import { toast } from "sonner";

import { LeadType } from "@/types/lead";
import { getEnumValues } from "@/lib/helper/enum-converter";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadUpdateByIdType } from "@/actions/lead";

type Props = {
  id: string;
  type: string;
  disabled?: boolean;
  onChange?: (e: string) => void;
};

export const LeadTypeSelect = ({ id, type, disabled, onChange }: Props) => {
  const leadTypes = getEnumValues(LeadType);
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
      disabled={disabled}
    >
      <SelectTrigger className="bg-background">
        <SelectValue placeholder="Select Lead Type" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {leadTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
