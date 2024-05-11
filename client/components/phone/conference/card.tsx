import React from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { TwilioConference } from "@/types/twilio";

type ConferenceCardProps = {
  conference: TwilioConference;
};

export const ConferenceCard = ({ conference }: ConferenceCardProps) => {
  return (
    <div className="border p-2 w-full text-center">
      <h4 className="text-muted-foreground">{conference.friendlyName}</h4>
      <CardData
        title="Date Created"
        value={format(conference.dateCreated, "MM-dd-yy hh:mm")}
      />
      <CardData title="Sid" value={conference.sid} />
      <Button
        variant="outline"
        onClick={() => {
          userEmitter.emit("participantsFetch", conference.sid);
        }}
      >
        Show Participants
      </Button>
      {/* <CardData title="Account Sid" value={conference.accountSid} />
      <CardData
        title="Date Created"
        value={conference.dateCreated.toString()}
      />
      <CardData
        title="Date Updated"
        value={conference.dateUpdated.toString()}
      />
      <CardData title="Api Version" value={conference.apiVersion} />
      <CardData title="Friendly Name" value={conference.friendlyName} /> */}
      {/* <CardData title="Sid" value={conference.sid} />
      <CardData title="Status" value={conference.status} />
      <CardData title="Uri" value={conference.uri} /> */}
    </div>
  );
};
