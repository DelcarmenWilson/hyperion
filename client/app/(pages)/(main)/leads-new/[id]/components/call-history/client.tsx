"use client";
import { PhoneOutgoing } from "lucide-react";
import { useLeadCallData } from "@/hooks/lead/use-call";
import { useLeadId } from "@/hooks/lead/use-lead";

import { CallHistoryActions } from "@/components/callhistory/actions";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getPhoneStatusText } from "@/formulas/phone";
import { formatDateTime } from "@/formulas/dates";
import { formatSecondsToTime } from "@/formulas/numbers";

export const CallHistoryClient = () => {
  const { leadId } = useLeadId();
  const { onGetCalls } = useLeadCallData();
  const { calls, callsFetching } = onGetCalls(leadId);

  return (
    <div className="text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Direction</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date / Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <SkeletonWrapper isLoading={callsFetching} fullWidth>
          <TableBody>
            {calls?.map((call) => (
              <TableRow key={call.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {call.direction.toLowerCase() === "inbound" ? (
                      getPhoneStatusText(call.status as string)
                    ) : (
                      <>
                        <PhoneOutgoing size={16} />
                        {call.direction}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {call.duration && formatSecondsToTime(call.duration)}
                </TableCell>
                <TableCell> {formatDateTime(call.createdAt)}</TableCell>
                <TableCell>
                  <CallHistoryActions call={call} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </SkeletonWrapper>
      </Table>
      {!calls?.length && (
        <p className="text-muted-foreground text-center mt-2">No calls found</p>
      )}
    </div>
  );
};
