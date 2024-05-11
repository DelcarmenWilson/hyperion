import React from "react";
import socket from "@/lib/socket";
import { usePhone } from "@/hooks/use-phone";
import { ParticipantCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Button } from "@/components/ui/button";

export const ParticipantList = () => {
  const { lead, conference, participants } = usePhone();

  if (!participants) return <EmptyCard title="No partipants left" />;
  return (
    <div className="bg-background w-full h-full overflow-hidden overflow-y-auto pointer-events-auto rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="text-center text-muted-foreground text-lg font-bold">
          Participants
        </h4>
        <Button onClick={() => socket?.emit("coach-request", lead, conference)}>
          Coaching
        </Button>
      </div>
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
