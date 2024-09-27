"use client";
import { userEmitter } from "@/lib/event-emmiter";
import {
  useLeadStatusActions,
  useLeadStatuses,
} from "@/components/global/selects/hooks/use-statuses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SkeletonWrapper from "@/components/skeleton-wrapper";

type Props = {
  id: string;
  status: string;
  onSetStatus?: (c: "status", e: string) => void;
};

export const LeadStatusSelect = ({ id, status, onSetStatus }: Props) => {
  const { statuses, isFetchingStatuses } = useLeadStatuses();
  const { onLeadStatusUpdate, isPendingLeadStatusUpdate } =
    useLeadStatusActions();
  const onLeadStatusChanged = (e: string) => {
    if (onSetStatus) onSetStatus("status", e);
    else {
      onLeadStatusUpdate(id, e);
      userEmitter.emit("leadStatusChanged", id, e);
    }
  };

  return (
    <SkeletonWrapper isLoading={isFetchingStatuses}>
      <Select
        name="ddlLeadStatus"
        disabled={status == "Do_Not_Call" || isPendingLeadStatusUpdate}
        onValueChange={onLeadStatusChanged}
        defaultValue={status}
      >
        <SelectTrigger>
          <SelectValue placeholder="Lead Status" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {onSetStatus && <SelectItem value="%">All</SelectItem>}
          {statuses?.map((status) => (
            <SelectItem key={status.id} value={status.status}>
              {status.status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
};
