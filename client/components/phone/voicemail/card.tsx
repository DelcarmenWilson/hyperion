import { format } from "date-fns";
import { Eye, MoreHorizontal, Phone, Trash } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Voicemail } from "@/types";
import { AudioPlayer } from "@/components/custom/audio-player";
import { toast } from "sonner";

type VoicemailCardProps = {
  voicemail: Voicemail;
  onUpdate: (e: string) => void;
};

export const VoicemailCard = ({
  voicemail: vm,
  onUpdate,
}: VoicemailCardProps) => {
  const { onVoicemailOpen } = usePhone();
  const onCallBack = () => {
    //TODO - need to implement this asap
    toast.error("This feature is not available yet!");
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
      <TableCell>{format(vm.updatedAt, "MM/dd hh:mm aa")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => onVoicemailOpen(vm)}
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
        {/* <Button
          className="me-2"
          variant="outline"
          size="icon"
          onClick={() => onVoicemailOpen(vm)}
        >
          <Eye size={16} />
        </Button>
        <Button
          variant="outlinedestructive"
          size="icon"
          onClick={() => onUpdate(vm.id)}
        >
          <Trash size={16} />
        </Button> */}
      </TableCell>
    </TableRow>
  );
};
