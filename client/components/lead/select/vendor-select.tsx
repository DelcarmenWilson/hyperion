"use client";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { LeadVendor } from "@/types/lead";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const leadVendors = getEnumValues(LeadVendor);
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
        {leadVendors.map((vendor) => (
          <SelectItem key={vendor.value} value={vendor.value}>
            {vendor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
