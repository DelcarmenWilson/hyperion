"use client";
import { useCarriers } from "./hooks/use-carriers";

import { SelectType } from "./types/select-types";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CarrierSelect = ({
  defaultValue,
  onValueChange,
  disabled,
}: SelectType) => {
  const { carriers, isFetchingCarriers } = useCarriers();
  return (
    <SkeletonWrapper isLoading={isFetchingCarriers}>
      <Select
        name="ddlLeadStatus"
        disabled={disabled}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Carrier" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {carriers?.map((carrier) => (
            <SelectItem key={carrier.id} value={carrier.carrierId}>
              {carrier.carrier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
};
