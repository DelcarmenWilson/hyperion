"use client";
import { useEffect } from "react";
import { Pencil, Phone } from "lucide-react";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadData, useLeadId } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/stores/phone-store";

import { LeadCommunicationType, LeadDefaultStatus } from "@/types/lead";

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

export const LeadSidebar = () => {
  const { onPhoneOutOpen } = usePhoneStore();
  const { setLeadId, onMainFormOpen, onGeneralFormOpen, setConversationId } =
    useLeadStore();
  const { leadId } = useLeadId();
  const {
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
    onGetLeadBasicInfo,
    onGetLead,
  } = useLeadData();
  const { leadBasic, leadBasicFetching } = onGetLeadBasicInfo(leadId);
  const { lead } = onGetLead(leadId);

  const callCount = leadBasic?.conversations[0].communications.filter(
    (e) => e.type != LeadCommunicationType.SMS
  ).length;

  const fullName = `${leadBasic?.firstName} ${leadBasic?.lastName}`;

  useEffect(() => {
    if (!leadId) return;
    setLeadId(leadId);
  }, [leadId]);

  useEffect(() => {
    if (!leadBasic) return;
    setConversationId(leadBasic.conversations[0].id);
  }, [leadBasic]);

  if (!leadBasic || !leadId) return null;

  return (
    <div className="flex flex-col bg-background h-full p-2 overflow-hidden">
      <SkeletonWrapper isLoading={leadBasicFetching}>
        <div>
          <h3 className="text-3xl text-primary font-bold leading-2 tracking-tight">
            {fullName}
          </h3>
          <div className="grid grid-cols-2 justify-between items-center gap-2">
            <LeadDropDown
              lead={lead}
              conversationId={leadBasic.conversations[0].id}
              action
            />
            <Button
              variant="outlineprimary"
              className="relative gap-2"
              disabled={leadBasic.statusId == LeadDefaultStatus.DONOTCALL}
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
      <ScrollArea>
        <LeadSection
          label="Main"
          hint="Main Info"
          onEdit={() => onMainFormOpen(leadBasic.id)}
        >
          <MainInfoClient leadId={leadId} noConvo={false} showEdit={false} />

          <CallInfo leadId={leadId} showBtnCall={false} />
          <div className="border rounded-sm shadow-md p-2">
            <div className="flex justify-between items-center pb-1">
              <h4 className="text-muted-foreground">Caller Id</h4>
            </div>
            <div className="flex items-center gap-1">
              {edit ? (
                <PhoneSwitcher
                  number={defaultNumber!}
                  onSetDefaultNumber={(e) => onSetDefaultNumber(leadId, e)}
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
          <GeneralInfoClient
            leadId={leadId}
            showInfo
            size="sm"
            showEdit={false}
          />
        </LeadSection>
        <LeadSection label="Notes" hint="Notes">
          <NotesForm leadId={leadId} />
        </LeadSection>

        <LeadSection label="Policy" hint="Policy Info">
          <PolicyInfoClient leadId={leadId} />
        </LeadSection>
      </ScrollArea>
    </div>
  );
};
