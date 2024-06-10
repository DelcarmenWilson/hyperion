"use client";
import { useState } from "react";
import { toast } from "sonner";

import { Voicemail } from "@/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      {!voicemails?.length ? (
        <p className="text-muted-foreground text-center p-4">
          No Pending Voicemails
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Recording</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voicemails.map((vm) => (
              <VoicemailCard key={vm.id} voicemail={vm} onUpdate={onUpdate} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
