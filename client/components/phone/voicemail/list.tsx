"use client";
import { useEffect } from "react";
import { Eye, MoreHorizontal, Phone, Trash } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { usePhoneContext } from "@/providers/phone";
import { usePhoneStore } from "@/stores/phone-store";
import axios from "axios";
import { format } from "date-fns";

import { FullCall } from "@/types";

import { AudioPlayer } from "@/components/custom/audio-player";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { voicemailUpdateByIdListened } from "@/actions/voicemail";
import { formatSecondsToTime } from "@/formulas/numbers";

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
    <ScrollArea>
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
              <TableHead>Duration</TableHead>
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
    </ScrollArea>
  );
};

type VoicemailCardProps = {
  voicemail: FullCall;
  onUpdate: (e: string) => void;
};

const VoicemailCard = ({ voicemail: vm, onUpdate }: VoicemailCardProps) => {
  const { onCallOpen, onPhoneOutOpen, onPhoneOutClose } = usePhoneStore();

  const onCallBack = async () => {
    //TO DO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId: vm?.lead?.id,
    });
    const lead = response.data;
    onPhoneOutClose();
    onPhoneOutOpen(lead);
  };
  return (
    <TableRow key={vm.id}>
      <TableCell className="font-medium">
        {vm.lead ? vm.lead.firstName : vm.from}
      </TableCell>
      <TableCell>
        <AudioPlayer
          src={vm.recordUrl as string}
          // onListened={() => onUpdate(vm.id)}
        />
      </TableCell>
      <TableCell>{formatSecondsToTime(vm.recordDuration)}</TableCell>
      <TableCell>{format(vm.updatedAt, "MM/dd hh:mm aa")}</TableCell>
      <TableCell className="text-end justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => onCallOpen(vm, "voicemail")}
            >
              <Eye size={16} />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={onCallBack}
            >
              <Phone size={16} />
              Call Back
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => onUpdate(vm.id)}
            >
              <Trash size={16} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
