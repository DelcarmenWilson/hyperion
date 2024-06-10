import React from "react";
import { TwilioConference } from "@/types";
import { ConferenceCard } from "./card";

type ConferenceListProps = {
  conferences: TwilioConference[];
};
export const ConferenceList = ({ conferences }: ConferenceListProps) => {
  if (!conferences) return null;
  return (
    <div className="bg-background w-[400px] h-72 overflow-hidden overflow-y-auto pointer-events-auto rounded-lg">
      <h4 className="text-center text-muted-foreground text-lg font-bold">
        Conferences
      </h4>
      <div className="flex flex-col items-center gap-2">
        {conferences.map((conference) => (
          <ConferenceCard key={conference.sid} conference={conference} />
        ))}
      </div>
    </div>
  );
};
