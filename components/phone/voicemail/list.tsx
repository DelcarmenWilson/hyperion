"use client";
import { useState } from "react";
import { toast } from "sonner";

import { Voicemail } from "@/types/phone";
import { VoicemailCard } from "./card";
import { voicemailUpdateByIdListened } from "@/actions/voicemail";

type VoicemailListProps = {
  initVoicemails: Voicemail[] | null;
};
export const VoicemailList = ({ initVoicemails }: VoicemailListProps) => {
  const [voicemails, setVoicemails] = useState(initVoicemails);

  const onUpdate = (id: string) => {
    voicemailUpdateByIdListened(id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        const vm = voicemails?.filter((e) => e.id != id);
        if (vm) {
          setVoicemails(vm);
        }
      }
    });
  };
  return (
    <div className="text-sm">
      <div className="grid grid-cols-4 items-center text-muted-foreground">
        <span>From</span>
        <span>Recording</span>
        <span>Date/Time</span>
        <span>Actions</span>
      </div>

      <div className="grid grid-cols-4 items-center py-1">
        {voicemails?.map((vm) => (
          <VoicemailCard key={vm.id} voicemail={vm} onUpdate={onUpdate} />
        ))}
      </div>
      {!voicemails?.length && (
        <p className="text-muted-foreground text-center p-4">
          No Pending Voicemails
        </p>
      )}
    </div>
  );
};
