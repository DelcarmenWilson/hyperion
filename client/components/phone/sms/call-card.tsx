import { PhoneOutgoing } from "lucide-react";

import AudioPlayerHp from "@/components/custom/audio-player-hp";

import { formatDistance } from "date-fns";
import { getPhoneStatusText } from "@/formulas/phone";

type CallCardProps = {
  direction: string;
  duration: number;
  recordUrl: string;
  status: string;
  createdAt: Date;
};

export const CallCard = ({
  direction,
  status,
  duration,
  recordUrl,
  createdAt,
}: CallCardProps) => {
  return (
    <div className="relative bg-gradient text-sm w-full p-1 rounded mb-1">
      <div className="flex flex-col gap-1 bg-background/75 py-2 px-3 rounded">
        <div className="flex justify-between items-center text-muted-foreground">
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
          {duration > 8 && <AudioPlayerHp src={recordUrl} />}
        </div>
      </div>
    </div>
  );
};
