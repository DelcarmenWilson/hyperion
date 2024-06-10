import React, { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { TwilioParticipant } from "@/types";

type ParticipantCardProps = {
  participant: TwilioParticipant;
  isLead: boolean;
  name: string | undefined;
};
export const ParticipantCard = ({
  participant,
  isLead,
  name,
}: ParticipantCardProps) => {
  const [muted, setMuted] = useState(participant.muted);
  const [hold, setHold] = useState(participant.hold);
  const [coaching, setCoaching] = useState(participant.coaching);
  const onParticipantUpdate = (label: string, value: boolean) => {
    axios
      .post("/api/twilio/conference/participant/update", {
        conferenceId: participant.conferenceSid,
        participantId: participant.callSid,
        label,
        value,
      })
      .then((data) => {
        if (label == "hangup")
          userEmitter.emit("participantsFetch", participant.conferenceSid);
      });
  };

  return (
    <div className="shadow-sm p-2 w-full">
      <div className="flex justify-between items-center">
        <h4 className="text-muted-foreground">{name}</h4>

        <Button
          size="xs"
          disabled={!isLead}
          onClick={() => onParticipantUpdate("hangup", true)}
        >
          Hangup
        </Button>
      </div>
      <div className="flex items-start gap-2">
        {/* <div className="flex justify-between items-center gap-2">
          muted
          <Switch
            disabled={enableControls}
            checked={muted}
            onCheckedChange={() =>
              setMuted((muted) => {
                onParticipantUpdate("muted", !muted);
                return !muted;
              })
            }
          />
        </div> */}

        {isLead ? (
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold">Hold</span>
            <Switch
              checked={hold}
              onCheckedChange={() =>
                setHold((hold) => {
                  onParticipantUpdate("hold", !hold);
                  return !hold;
                })
              }
            />
          </div>
        ) : (
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold">Coaching</span>
            <Switch
              checked={coaching}
              onCheckedChange={() =>
                setCoaching((coaching) => {
                  onParticipantUpdate("coaching", !coaching);
                  return !coaching;
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
