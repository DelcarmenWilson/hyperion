"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PhoneOutgoing } from "lucide-react";

import { Call } from "@prisma/client";
import { FullCall } from "@/types";

import { CallHistoryActions } from "@/components/callhistory/actions";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatSecondsToTime } from "@/formulas/numbers";
import { getPhoneStatusText } from "@/formulas/phone";
import { formatDateTime } from "@/formulas/dates";
import { getCallsForLead } from "@/actions/call";

//TODO - need to give some TLC to this Component
const LeadCalls = ({ leadId }: { leadId: string }) => {
  const { data: calls, isFetching } = useQuery<FullCall[]>({
    queryFn: () => getCallsForLead(leadId),
    queryKey: ["leadCalls"],
  });
  //TODO find the other component that looks just like this one
  useEffect(() => {
    const callHandler = (newCall: Call) => {
      //TODO - need to invalidate the quesry instead
      // setCalls((current) => {
      //   const existingCall = current.find((e) => e.id == newCall.id);
      //   if (existingCall) {
      //     current.shift();
      //   }
      //   return [newCall, ...current];
      // });
    };

    return () => {};
  }, []);
  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="text-sm">
        <div className="grid grid-cols-5 items-center  gap-2 text-md text-muted-foreground">
          <span>Direction</span>
          <span>Duration</span>
          <span className="col-span-2">Date / Time</span>
          <span>Actions</span>
        </div>

        {calls?.length ? (
          <>
            {calls?.map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
          </>
        ) : (
          <p className="text-muted-foreground text-center mt-2">
            No calls found
          </p>
        )}
      </div>
    </SkeletonWrapper>
  );
};

const CallCard = ({ call }: { call: FullCall }) => {
  return (
    <div className="grid grid-cols-5 items-center gap-2 border-b py-2 ">
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
      <div>{call.duration && formatSecondsToTime(call.duration)}</div>
      <div className="col-span-2">
        {call.createdAt && formatDateTime(call.createdAt)}
      </div>
      {/* <div>{call.recordUrl && <AudioPlayer src={call.recordUrl} />}</div> */}
      <div>
        <CallHistoryActions call={call} />
      </div>
    </div>
  );
};

export default LeadCalls;
