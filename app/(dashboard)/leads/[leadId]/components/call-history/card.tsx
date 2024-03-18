"use client";
import { PhoneOutgoing } from "lucide-react";
import { format } from "date-fns";

import { AudioPlayer } from "@/components/custom/audio-player";
import { Call } from "@prisma/client";
import { formatSecondsToTime } from "@/formulas/numbers";
import { getPhoneStatusText } from "@/formulas/phone";

interface CallHistoryCardProps {
  call: Call;
}
export const CallHistoryCard = ({ call }: CallHistoryCardProps) => {
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
        {call.createdAt && format(call.createdAt, "MM-dd-yyyy hh:mm aaaa")}
      </div>
      <div>{call.recordUrl && <AudioPlayer src={call.recordUrl} />}</div>
    </div>
  );
};
