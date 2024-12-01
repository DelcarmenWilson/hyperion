"use client";
import { Phone, PhoneOutgoing } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import axios from "axios";

import { usePhoneStore } from "@/hooks/use-phone";

import AudioPlayerHp from "@/components/custom/audio-player-hp";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate, formatDateTime } from "@/formulas/dates";
import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber } from "@/formulas/phones";
import { getPhoneStatusText } from "@/formulas/phone";

export const CallModal = () => {
  const {
    isCallOpen,
    onCallClose,
    fullCall: call,
    callType,
    onPhoneOutOpen,
  } = usePhoneStore();

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
  const leadName = call?.lead
    ? `${call?.lead?.firstName} ${call?.lead?.lastName}`
    : formatPhoneNumber(call?.from as string);
  const caller = call?.from.startsWith("client");

  return (
    <Dialog open={isCallOpen} onOpenChange={onCallClose}>
      <DialogContent>
        <CustomDialogHeader
          icon={Phone}
          title="Call details"
          subTitle={caller ? "" : formatPhoneNumber(call.from)}
        />
        <ScrollArea className="max-h-[400px] relative">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-semibold py-2 capitalize">
              <span className="text-primary">{leadName}</span>
            </p>
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
            <CardData label="From" value={caller ? "You" : leadName} />
            <CardData label="Date" value={formatDateTime(call.createdAt)} />
            <CardData label="Phone #" value={formatPhoneNumber(call.from)} />
            <CardData
              label="Duration"
              value={formatSecondsToTime(call.recordDuration)}
            />
          </div>
          {call.duration && call.duration > 8 && (
            <div className="flex-center">
              {/* <AudioPlayer src={voicemail.recordUrl as string} size={32} /> */}
              <AudioPlayerHp src={call.recordUrl as string} />
            </div>
          )}

          {callType == "voicemail" && (
            <p className=" border p-4">{call.transcriptionText}</p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mt-auto">
            <div>
              {callType == "voicemail" && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="w-full"
                >
                  Delete
                </Button>
              )}
            </div>
            <Button className="flex gap-2" onClick={onCallBack}>
              <Phone size={16} />
              Call Back
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
