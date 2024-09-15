"use client";
import { useLeadStatuses } from "./hooks/use-statuses";

import { SelectType } from "./types/select-types";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StatusSelect = ({
  defaultValue,
  onValueChange,
  disabled,
}: SelectType) => {
  const { statuses, isFetchingStatuses } = useLeadStatuses();

  return (
    <SkeletonWrapper isLoading={isFetchingStatuses}>
      <Select
        name="ddlLeadStatus"
        disabled={disabled}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Lead Status" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {statuses?.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {status.status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
};
