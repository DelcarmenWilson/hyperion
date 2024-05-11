import { format } from "date-fns";
import { Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Voicemail } from "@/types/phone";
import { AudioPlayer } from "@/components/custom/audio-player";

type VoicemailCardProps = {
  voicemail: Voicemail;
  onUpdate: (e: string) => void;
};

export const VoicemailCard = ({
  voicemail: vm,
  onUpdate,
}: VoicemailCardProps) => {
  return (
    <TableRow key={vm.id}>
      <TableCell className="font-medium">
        {vm.lead ? vm.lead.firstName : vm.from}
      </TableCell>
      <TableCell>
        <AudioPlayer
          src={vm.recordUrl as string}
          onListened={() => onUpdate(vm.id)}
        />
      </TableCell>
      <TableCell>{format(vm.updatedAt, "MM/dd hh:mm aa")}</TableCell>
      <TableCell>
        <Button
          variant="outlinedestructive"
          size="icon"
          onClick={() => onUpdate(vm.id)}
        >
          <Trash size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};
