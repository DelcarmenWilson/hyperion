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
import { leadDefaultStatus } from "@/constants/lead";

type Props = {
  id: string;
  statusId: string;
  onSetStatus?: (c: "statusId", e: string) => void;
};

export const LeadStatusSelect = ({ id, statusId, onSetStatus }: Props) => {
  const { statuses, isFetchingStatuses } = useLeadStatuses();
  const { onLeadStatusUpdate, isPendingLeadStatusUpdate } =
    useLeadStatusActions();
  const onLeadStatusChanged = (e: string) => {
    if (onSetStatus) onSetStatus("statusId", e);
    else {
      onLeadStatusUpdate(id, e);
      userEmitter.emit("leadStatusChanged", id, e);
    }
  };

  return (
    <SkeletonWrapper isLoading={isFetchingStatuses}>
      <Select
        name="ddlLeadStatus"
        disabled={
          statusId == leadDefaultStatus["DoNotCall"] ||
          isPendingLeadStatusUpdate
        }
        onValueChange={onLeadStatusChanged}
        defaultValue={statusId}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Lead Status" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {onSetStatus && <SelectItem value="%">All</SelectItem>}
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
