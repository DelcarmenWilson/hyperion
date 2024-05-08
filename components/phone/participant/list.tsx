import { ParticipantType } from "@/types";
import React from "react";
import { ParticipantCard } from "./card";

type ParticipantListProps = {
  participants: ParticipantType[];
};
export const ParticipantList = ({ participants }: ParticipantListProps) => {
  if (!participants) return null;
  return (
    <div className="bg-background w-[400px] h-72 overflow-hidden overflow-y-auto pointer-events-auto rounded-lg">
      <h4 className="text-center text-muted-foreground text-lg font-bold">
        Participants
      </h4>
      <div className="flex flex-col items-center gap-2">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.callSid}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};
