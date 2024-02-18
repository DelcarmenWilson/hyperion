"use client";

import { Voicemail } from "@/types";
import { AudioPlayer } from "@/components/custom/audio-player";
import { format } from "date-fns";

type VoicemailOutProps = {
  voicemails: Voicemail[] | null;
};
export const VoicemailOut = ({ voicemails }: VoicemailOutProps) => {
  return (
    <div className="text-sm">
      <h3 className="font-semibold text-lg">Voicemail</h3>
      <div className="grid grid-cols-3 items-center text-muted-foreground">
        <span>From</span>
        <span>Recording</span>
        <span>Date/Time</span>
      </div>
      {!voicemails?.length && (
        <p className="text-muted-foreground text-center p-4">
          No Pending Voicemails
        </p>
      )}
      {voicemails?.map((vm) => (
        <div key={vm.id} className="grid grid-cols-3 items-center py-1">
          <p className="cols-span-2">{vm.lead ? vm.lead.firstName : vm.from}</p>
          <AudioPlayer src={vm.recordUrl} />
          <p>{format(vm.updatedAt, "MM/dd hh:mm aa")}</p>
        </div>
      ))}
      {/* {JSON.stringify(voicemails)} */}
    </div>
  );
};
