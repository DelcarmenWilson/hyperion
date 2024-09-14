"use client";
import { useLeadStatuses } from "@/hooks/lead/use-statuses";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type Props = {
  defaultValue: string;
  onValueChange: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
};

export const StatusSelect = ({
  defaultValue,
  onValueChange,
  disabled,
}: Props) => {
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
