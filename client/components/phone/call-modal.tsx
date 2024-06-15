"use client";
import { Phone, PhoneOutgoing } from "lucide-react";
import { toast } from "sonner";
import { userEmitter } from "@/lib/event-emmiter";

import { usePhone } from "@/hooks/use-phone";

import { AudioPlayerHp } from "@/components/custom/audio-player-hp";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardData } from "@/components/reusable/card-data";
import { formatPhoneNumber } from "@/formulas/phones";
import { formatSecondsToTime } from "@/formulas/numbers";
import { formatDate } from "@/formulas/dates";
import axios from "axios";
import { getPhoneStatusText } from "@/formulas/phone";

export const CallModal = () => {
  const { isCallOpen, onCallClose, call, callType, onPhoneOutOpen } =
    usePhone();
  const from = call?.lead
    ? `${call?.lead?.firstName} ${call?.lead?.lastName}`
    : formatPhoneNumber(call?.from as string);

  const onCallBack = async () => {
    //TO DO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId: call?.lead?.id,
    });
    const lead = response.data;
    onCallClose();
    onPhoneOutOpen(lead);
  };
  const onDelete = () => {
    if (!call) return;
    userEmitter.emit("voicemailDeleted", call.id);
    onCallClose();
  };
  if (!call) return null;
  return (
    <Dialog open={isCallOpen} onOpenChange={onCallClose}>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <div className="flex justify-between items-center">
          <h4 className="text-2xl font-semibold py-2 capitalize">
            <span className="capitalize">{callType}</span> -{" "}
            <span className="text-primary">{from}</span>
          </h4>
          <div className="flex gap-2 items-center">
            {call.direction.toLowerCase() === "inbound" ? (
              getPhoneStatusText(call.status as string)
            ) : (
              <>
                <PhoneOutgoing size={16} />
                {call.direction}
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <CardData label="From" value={from} />
          <CardData label="Date" value={formatDate(call.updatedAt)} />
          <CardData label="Phone #" value={formatPhoneNumber(call.from)} />
          <CardData
            label="Duration"
            value={formatSecondsToTime(call.recordDuration)}
          />
        </div>
        <div className="flex-center">
          {/* <AudioPlayer src={voicemail.recordUrl as string} size={32} /> */}
          <AudioPlayerHp src={call.recordUrl as string} />
        </div>

        {callType == "voicemail" && (
          <p className=" border p-4">{call.transcriptionText}</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mt-auto">
          <Button className="flex gap-2" onClick={onCallBack}>
            <Phone size={16} />
            Call Back
          </Button>
          {callType == "voicemail" && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
