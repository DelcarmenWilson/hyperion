"use client";

import { usePhoneModal } from "@/hooks/use-phone-modal";
// import { Info } from "@/components/lead/info";
// import { NotesForm } from "@/components/lead/notes-form";
// import { CallInfo } from "@/components/lead/call-info";
import { cn } from "@/lib/utils";
import { DropDown } from "@/components/lead/dropdown";
import { ExtraInfo } from "@/components/lead/extra-info";
import { AppointmentBox } from "@/components/lead/appointment";
import { Info } from "../lead/info";
import { CallInfo } from "../lead/call-info";
import { NotesForm } from "../lead/notes-form";

export const PhoneLeadInfo = () => {
  const {
    lead,
    isPhoneLeadOpen: isOpen,
    onPhoneLeadOpen: onOpen,
    onPhoneLeadClose: onClose,
  } = usePhoneModal();
  const OnToggleOpen = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };
  if (!lead) {
    return null;
  }
  return (
    <div className="flex justify-start">
      <div
        className="flex items-center justify-center w-9  h-full border overflow-hidden relative cursor-pointer hover:bg-secondary "
        onClick={OnToggleOpen}
      >
        <p className="text-primary rotate-90 text-sm">Lead Info</p>
      </div>
      <div
        className={cn(
          "flex flex-col h-full transition-transform",
          isOpen ? "flex-1" : "hidden"
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
      </div>
    </div>
  );
};
