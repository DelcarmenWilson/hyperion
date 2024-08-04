"use client";
import { PhoneOutgoing } from "lucide-react";
import { FullCall } from "@/types";
import { formatSecondsToTime } from "@/formulas/numbers";
import { getPhoneStatusText } from "@/formulas/phone";
import { formatDateTime } from "@/formulas/dates";
import { CallHistoryActions } from "@/components/callhistory/actions";

export const CallHistoryCard = ({ call }: { call: FullCall }) => {
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
