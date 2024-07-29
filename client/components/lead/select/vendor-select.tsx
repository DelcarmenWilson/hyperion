"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allVendors } from "@/constants/lead";

type Props = {
  vendor: string;
  onSetVendor: (c: "vendor", e: string) => void;
  filter?: boolean;
};

export const LeadVendorSelect = ({
  vendor,
  onSetVendor,
  filter = false,
}: Props) => {
  return (
    <Select
      name="ddlVendor"
      onValueChange={(e) => onSetVendor("vendor", e)}
      defaultValue={vendor}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Vendor" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {filter && <SelectItem value="%">All</SelectItem>}
        {allVendors.map((vendor) => (
          <SelectItem key={vendor.name} value={vendor.value}>
            {vendor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
