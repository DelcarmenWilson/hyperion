"use client";

import { useState } from "react";
import { usePhoneModal } from "@/hooks/use-phone-modal";

import { cn } from "@/lib/utils";

import { DropDown } from "@/components/lead/dropdown";
import { ExtraInfo } from "@/components/lead/extra-info";
import { AppointmentBox } from "@/components/lead/appointment";
import { Info } from "@/components/lead/info";
import { CallInfo } from "@/components/lead/call-info";
import { NotesForm } from "@/components/lead/notes-form";
import { Button } from "@/components/ui/button";

export const PhoneLeadInfo = () => {
  const { lead } = usePhoneModal();

  const [isOpen, setIsOpen] = useState(false);

  // const OnToggleOpen = () => {
  //   if (isOpen) {
  //     onClose();
  //   } else {
  //     onOpen();
  //   }
  // };

  if (!lead) {
    return null;
  }
  return (
    <div className="flex flex-1 justify-start relative overflow-hidden">
      <div className="flex items-center justify-center w-[44px] h-full overflow-hidden relative px-2">
        <Button
          className="rotate-90"
          variant={isOpen ? "default" : "outline"}
          onClick={() => setIsOpen(!isOpen)}
        >
          Lead Info
        </Button>
      </div>

      {/* <div
        className={cn(
          "flex flex-col w-full h-full transition-transform relative overflow-hidden",
          isOpen && "w-0"
        )}
      > */}
      <div
        className={cn(
          "flex flex-col relative transition-[right] -right-full ease-in-out duration-100 w-0 h-full overflow-hidden",
          isOpen && "w-full right-0"
        )}
      >
        <h3 className="text-center text-2xl font-bold ">
          <span className="text-primary">
            {lead.firstName} {lead.lastName}
          </span>
          {" | "}
          <span className="italic text-muted-foreground mr-2">
            {lead.gender.substring(0, 1)} {lead.maritalStatus}
          </span>
          <DropDown lead={lead} />
        </h3>
        <div className="grid grid-cols-3 gap-2 p-2">
          <Info lead={lead} />
          <AppointmentBox lead={lead} showInfo />
          <CallInfo lead={lead!} showBtnCall={false} />
          <ExtraInfo lead={lead} />
          <NotesForm
            leadId={lead?.id as string}
            intialNotes={lead?.notes as string}
          />
        </div>
        {/* <PhoneScript /> */}
      </div>
    </div>
  );
};
