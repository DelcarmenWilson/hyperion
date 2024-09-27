import React, { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePhoneStore } from "@/hooks/use-phone";
import SocketContext from "@/providers/socket";
import { toast } from "sonner";

import { ParticipantCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ParticipantListProps = {
  onClose: () => void;
};
export const ParticipantList = ({ onClose }: ParticipantListProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { conference, participants } = usePhoneStore();
  const [localConference, setLocalConference] = useState(conference);
  const [localParticipants, setLocalParticipants] = useState(participants);

  useEffect(() => {
    setLocalConference(conference);
  }, [conference]);

  useEffect(() => {
    setLocalParticipants(participants);
  }, [participants]);
  return (
    <div className="flex flex-col gap-2 bg-background w-full h-full overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <h4 className="text-center text-muted-foreground text-lg font-bold">
          Participants
        </h4>
        <Button
          variant="outlineprimary"
          size="sm"
          onClick={() => {
            socket?.emit("coach-request", localConference);
            toast.success("coach requested!");
          }}
        >
          Request A Coach
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      <div className="h-full w-full ">
        {!localParticipants ? (
          <EmptyCard title="No partipants found" />
        ) : (
          <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0">
            <CardContent className="flex flex-col overflow-y-auto items-center gap-2 p-1">
              {localParticipants
                .filter((e) => e.label != localConference?.agentId)
                .map((participant) => (
                  <ParticipantCard
                    key={participant.callSid}
                    participant={participant}
                    isLead={localConference?.leadId == participant?.label}
                    name={
                      localConference?.leadId == participant?.label
                        ? localConference?.leadName
                        : localConference?.coachName
                    }
                  />
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
