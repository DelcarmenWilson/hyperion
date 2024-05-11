import React, { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { TwilioParticipant } from "@/types/twilio";

type ParticipantCardProps = {
  participant: TwilioParticipant;
  enableControls: boolean;
};
export const ParticipantCard = ({
  participant,
  enableControls = true,
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
    <div className="border p-2 w-full text-center">
      <h4 className="text-muted-foreground">{participant.label!}</h4>
      <div className="flex items-center gap-2">
        <div>
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
        </div>

        <div>
          hold
          <Switch
            disabled={enableControls}
            checked={hold}
            onCheckedChange={() =>
              setHold((hold) => {
                onParticipantUpdate("hold", !hold);
                return !hold;
              })
            }
          />
        </div>

        <div>
          coaching
          <Switch
            disabled={enableControls}
            checked={coaching}
            onCheckedChange={() =>
              setCoaching((coaching) => {
                onParticipantUpdate("coaching", !coaching);
                return !coaching;
              })
            }
          />
        </div>
        <Button
          disabled={enableControls}
          onClick={() => onParticipantUpdate("hangup", true)}
        >
          Hangup
        </Button>
      </div>
    </div>
  );
};
