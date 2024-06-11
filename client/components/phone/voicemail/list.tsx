"use client";
import { useEffect } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { usePhoneContext } from "@/providers/phone";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VoicemailCard } from "./card";
import { voicemailUpdateByIdListened } from "@/actions/voicemail";

export const VoicemailList = () => {
  const { voicemails, setVoicemails } = usePhoneContext();

  const onVoicemailDeleted = async (id: string) => {
    const updatedVoicemail = await voicemailUpdateByIdListened(id);
    if (updatedVoicemail.success) {
      const vm = voicemails?.filter((e) => e.id != id);
      if (vm) {
        setVoicemails(vm);
      }
    } else toast.error(updatedVoicemail.error);
  };

  useEffect(() => {
    userEmitter.on("voicemailDeleted", (id) => onVoicemailDeleted(id));
  }, []);

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
              <VoicemailCard
                key={vm.id}
                voicemail={vm}
                onUpdate={onVoicemailDeleted}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
