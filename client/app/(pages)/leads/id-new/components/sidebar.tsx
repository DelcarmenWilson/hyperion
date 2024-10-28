"use client";
import { useEffect } from "react";
import { Pencil, Phone } from "lucide-react";
import { useLeadStore, useLeadData, useLeadId } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/hooks/use-phone";

import { Button } from "@/components/ui/button";
import { LeadSection } from "./section";

import { MainInfoClient } from "@/components/lead/info/main";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { Badge } from "@/components/ui/badge";
import { LeadDropDown } from "@/components/lead/dropdown";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { CallInfo } from "@/components/lead/info/call";
import { PhoneSwitcher } from "@/components/phone/addins/switcher";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { formatPhoneNumber } from "@/formulas/phones";
import { ScrollArea } from "@/components/ui/scroll-area";
import { leadDefaultStatus } from "@/constants/lead";

export const LeadSidebar = () => {
  const { onPhoneOutOpen } = usePhoneStore();
  const { setLeadId, onMainFormOpen, onGeneralFormOpen } = useLeadStore();
  const {
    leadBasic,
    isFetchingLeadBasic,
    lead,
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
  } = useLeadData();
  const { leadId } = useLeadId();

  const callCount = leadBasic?.calls?.length;

  const fullName = `${leadBasic?.firstName} ${leadBasic?.lastName}`;
  const conversations = lead?.conversations;

  useEffect(() => {
    if (!leadId) return;
    setLeadId(leadId);
  }, [leadId]);

  if (!leadBasic) return null;

  return (
    <div className="flex flex-col bg-background h-full p-2 overflow-hidden">
      <SkeletonWrapper isLoading={isFetchingLeadBasic}>
        <div>
          <h3 className="text-3xl text-primary font-bold leading-2 tracking-tight">
            {fullName}
          </h3>
          <div className="grid grid-cols-2 justify-between items-center gap-2">
            <LeadDropDown
              lead={lead!}
              conversationId={conversations ? conversations[0].id : undefined}
              action
            />
            <Button
              variant="outlineprimary"
              className="relative gap-2"
              disabled={leadBasic.statusId == leadDefaultStatus["Do_Not_Call"]}
              //TODO - emeditely need to add a function for this
              onClick={() => onPhoneOutOpen(lead!)}
              size="sm"
            >
              <Phone size={16} />
              Call {leadBasic.firstName}
              {callCount && callCount > 0 && (
                <Badge className=" rounded-full text-xs">{callCount}</Badge>
              )}
            </Button>
          </div>
        </div>
      </SkeletonWrapper>
      <ScrollArea className="flex-1 pb-2">
        {/* <div className="flex-1 overflow-y-auto pb-2"> */}
        <LeadSection
          label="Main"
          hint="Main Info"
          onEdit={() => onMainFormOpen(leadBasic.id)}
        >
          <MainInfoClient noConvo={false} showEdit={false} />

          <CallInfo showBtnCall={false} />
          <div className="pt-1">
            <p className="text-sm tracking-tighter leading-3">Caller Id </p>
            <div className="flex items-center gap-1">
              {edit ? (
                <PhoneSwitcher
                  number={defaultNumber!}
                  onSetDefaultNumber={onSetDefaultNumber}
                  onClose={() => setEdit(false)}
                />
              ) : (
                <>
                  <p className="font-bold">
                    {formatPhoneNumber(defaultNumber!)}
                  </p>
                  <Button
                    className="opacity-0 group-hover:opacity-100"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEdit(true)}
                  >
                    <Pencil size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </LeadSection>
        <LeadSection
          label="General"
          hint="General Info"
          onEdit={() => onGeneralFormOpen(leadBasic.id)}
        >
          <GeneralInfoClient showInfo showEdit={false} />
        </LeadSection>
        <LeadSection label="Notes" hint="Notes">
          <NotesForm />
        </LeadSection>

        <LeadSection label="Policy" hint="Policy Info">
          <PolicyInfoClient />
        </LeadSection>
        {/* </div> */}
      </ScrollArea>
    </div>
  );
};
