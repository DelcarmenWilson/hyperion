import { PhoneOutgoing } from "lucide-react";

import AudioPlayerHpSm from "@/components/custom/audio-player-hp-sm";
import { formatDistance } from "date-fns";
import { getPhoneStatusText } from "@/formulas/phone";
import { cn } from "@/lib/utils";
import { LeadCommunicationType } from "@/types/lead";
import { calculateTime } from "@/formulas/dates";

const setBg = (direction: string): { bg: string; pos: boolean } => {
  switch (direction) {
    case "outbound":
      return { bg: "bg-primary text-background", pos: false };
    case "inbound":
      return { bg: "bg-accent", pos: true };
    default:
      return {
        // bg: "bg-radial-gradient from-slate-500  to-white ",
        bg: "bg-gradient-to-tr from-slate-500  to-background",
        pos: true,
      };
  }
};

type CallCardProps = {
  direction: string;
  duration: number;
  type: string;
  recordDuration:number;
  recordUrl: string;
  status: string;
  createdAt: Date;
};

export const CallCard = ({
  direction,
  status,
  duration,
  type,
  recordDuration,
  recordUrl,
  createdAt,
}: CallCardProps) => {
  const isOwn = setBg(direction);
  return (
    <div className={cn("flex flex-col group mb-2", isOwn.pos && "items-end")}>
      <div
        className={cn(
          "relative text-sm w-[245px] rounded p-1 text-wrap break-words",
          isOwn.bg
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {direction.toLowerCase() === "inbound" ? (
              getPhoneStatusText(status)
            ) : (
              <>
                <PhoneOutgoing size={16} />
                {direction}
              </>
            )}
          </div>
          <span className="text-xs italic">
            {formatDistance(createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="flex-center">
          {recordDuration > 0 ? (
            <AudioPlayerHpSm src={recordUrl} text={type==LeadCommunicationType.VOICEMAIL?"voicemail":""} />
          ) : (
           
            <span className="uppercase font-bold">{status}     {isNaN(duration) ? "0:00" : calculateTime(duration)}</span>
          
          )}
        </div>
      </div>
    </div>
  );
};
