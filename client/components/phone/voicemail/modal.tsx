"use client";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";

import { usePhone } from "@/hooks/use-phone";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/custom/audio-player";
import { CardData } from "@/components/reusable/card-data";
import { formatPhoneNumber } from "@/formulas/phones";
import { formatSecondsToTime } from "@/formulas/numbers";

export const VoicemailModal = () => {
  const { isVoicemailOpen, onVoicemailClose, voicemail } = usePhone();
  const from = voicemail?.lead
    ? `${voicemail?.lead?.firstName} ${voicemail?.lead?.lastName}`
    : formatPhoneNumber(voicemail?.from as string);
  const onCallBack = () => {
    //TODO - need to implement this asap
    toast.error("This function is not available yet");
  };
  const onDelete = () => {
    if (!voicemail) return;
    userEmitter.emit("voicemailDeleted", voicemail.id);
    onVoicemailClose();
  };
  if (!voicemail) return null;
  return (
    <Dialog open={isVoicemailOpen} onOpenChange={onVoicemailClose}>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <h4 className="text-2xl font-semibold py-2 capitalize">
          Voicemail - <span className="text-primary">{from}</span>
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <CardData label="From" value={from} />
          <CardData
            label="Date"
            value={format(voicemail.updatedAt, "MM-dd-yyyy")}
          />
          <CardData label="Phone #" value={formatPhoneNumber(voicemail.from)} />
          <CardData
            label="Duration"
            value={
              voicemail.recordDuration
                ? formatSecondsToTime(voicemail.recordDuration)
                : ""
            }
          />
        </div>
        <div className="flex-center">
          <AudioPlayer src={voicemail.recordUrl as string} size={32} />
        </div>

        <p className=" border p-4">{voicemail.transcriptionText}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mt-auto">
          <Button className="flex gap-2" onClick={onCallBack}>
            <Phone size={16} />
            Call Back
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
