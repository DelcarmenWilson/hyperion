import React from "react";
import { X } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { usePhone } from "@/hooks/use-phone";

import { ParticipantCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type ParticipantListProps = {
  onClose: () => void;
};
export const ParticipantList = ({ onClose }: ParticipantListProps) => {
  const socket = useSocket();
  const { lead, conference, participants } = usePhone();

  return (
    <div className="flex flex-col gap-2 bg-background w-full h-full overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <h4 className="text-center text-muted-foreground text-lg font-bold">
          Participants
        </h4>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      <div className="h-full w-full overflow-y-auto">
        {!participants ? (
          <EmptyCard title="No partipants found" />
        ) : (
          <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0">
            <CardContent className="flex flex-col items-center gap-2 p-1">
              <Button
                variant="outlineprimary"
                size="sm"
                onClick={() => {
                  socket?.emit("coach-request", lead, conference);
                  toast.success("coach requested!");
                }}
              >
                Request A Coach
              </Button>
              {participants
                .filter((e) => e.label != conference?.agentId)
                .map((participant) => (
                  <ParticipantCard
                    key={participant.callSid}
                    participant={participant}
                    isLead={conference?.leadId == participant?.label}
                    name={
                      conference?.leadId == participant?.label
                        ? conference?.leadName
                        : conference?.coachName
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
