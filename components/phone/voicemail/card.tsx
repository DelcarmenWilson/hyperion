import { Voicemail } from "@/types/phone";
import { AudioPlayer } from "@/components/custom/audio-player";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type VoicemailCardProps = {
  voicemail: Voicemail;
  onUpdate: (e: string) => void;
};

export const VoicemailCard = ({
  voicemail: vm,
  onUpdate,
}: VoicemailCardProps) => {
  const onChange = () => {
    onUpdate(vm.id);
  };
  return (
    <>
      <span className="cols-span-2">
        {vm.lead ? vm.lead.firstName : vm.from}
      </span>
      <AudioPlayer src={vm.recordUrl as string} onListened={onChange} />
      <span className="">{format(vm.updatedAt, "MM/dd hh:mm aa")}</span>
      <Button variant="outlinedestructive" size="icon" onClick={onChange}>
        <Trash size={16} />
      </Button>
    </>
  );
};
