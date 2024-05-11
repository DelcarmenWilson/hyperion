import React, { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { TwilioParticipant } from "@/types/twilio";

type ParticipantCardProps = {
  participant: TwilioParticipant;
};
export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
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
            checked={coaching}
            onCheckedChange={() =>
              setCoaching((coaching) => {
                onParticipantUpdate("coaching", !coaching);
                return !coaching;
              })
            }
          />
        </div>
        <Button onClick={() => onParticipantUpdate("hangup", true)}>
          Hangup
        </Button>

        {/* <CardData
          title="endConferenceOnExit"
          value={paricipant.endConferenceOnExit.toString()}
        />

        <CardData
          title="startConferenceOnEnter"
          value={paricipant.startConferenceOnEnter.toString()}
        /> */}
      </div>

      {/* <CardData title="accountSid" value={paricipant.accountSid} />
      <CardData title="callSid" value={paricipant.callSid} />
      <CardData title="label" value={paricipant.label!} />
      <CardData title="callSidToCoach" value={paricipant.callSidToCoach!} />
      <CardData title="coaching" value={paricipant.coaching.toString()} />
      <CardData title="conferenceSid" value={paricipant.conferenceSid} />
      <CardData
        title="dateCreated"
        value={format(paricipant.dateCreated, "MM-dd-yyy")}
      />
      <CardData
        title="dateUpdated"
        value={format(paricipant.dateUpdated, "MM-dd-yyy")}
      />
      <CardData
        title="endConferenceOnExit"
        value={paricipant.endConferenceOnExit.toString()}
      />
      <CardData title="muted" value={paricipant.muted.toString()} />
      <CardData title="hold" value={paricipant.hold.toString()} />
      <CardData
        title="startConferenceOnEnter"
        value={paricipant.startConferenceOnEnter.toString()}
      />
      <CardData title="status" value={paricipant.status.toString()} />
      <CardData title="uri" value={paricipant.uri.toString()} /> */}
    </div>
  );
};
