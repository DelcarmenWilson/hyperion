"use client";
import { Pencil, Phone } from "lucide-react";
import { useLead, useLeadData } from "@/hooks/use-lead";
import { usePhone } from "@/hooks/use-phone";

import {
  LeadGeneralSchemaType,
  LeadMainSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";
import { Button } from "@/components/ui/button";
import { LeadSection } from "../../components/section";

import { MainInfoClient } from "@/components/lead/info/main";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { Badge } from "@/components/ui/badge";
import { LeadDropDown } from "@/components/lead/dropdown";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { CallInfo } from "@/components/lead/info/call";
import { useState } from "react";
import { PhoneSwitcher } from "@/components/phone/addins/switcher";
import { formatPhoneNumber } from "@/formulas/phones";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";

export const LeadSidebar = () => {
  const { onPhoneOutOpen } = usePhone();
  const {
    lead,
    isFetchingLead,
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
  } = useLeadData();
  const { onMainFormOpen, onGeneralFormOpen } = useLead();

  const callCount = lead?.calls?.filter(
    (e) => e.direction == "outbound"
  ).length;

  const fullName = `${lead?.firstName} ${lead?.lastName}`;

  if (!lead) return null;

  const leadMainInfo: LeadMainSchemaType = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    cellPhone: lead.cellPhone,
    email: lead.email || undefined,
    address: lead.address || undefined,
    city: lead.city || undefined,
    state: lead.state,
    zipCode: lead.zipCode || undefined,
    quote: lead.quote,
    status: lead.status,
    textCode: lead.textCode!,
  };

  const leadInfo: LeadGeneralSchemaType = {
    ...lead,
    dateOfBirth: lead.dateOfBirth || undefined,
    weight: lead.weight || undefined,
    height: lead.height || undefined,
    income: lead.income || undefined,
  };

  const leadPolicy: LeadPolicySchemaType = {
    ...lead.policy!,
    leadId: lead.id,
    startDate: lead.policy?.startDate!,
  };

  return (
    <div className="flex flex-col bg-background h-full p-2 overflow-hidden">
      <div>
        <h3 className="text-3xl text-primary font-bold leading-2 tracking-tight">
          {fullName}
        </h3>
        <div className="grid grid-cols-2 justify-between items-center gap-2">
          <LeadDropDown lead={lead} action />
          <Button
            variant="outlineprimary"
            className="relative gap-2"
            disabled={lead.status == "Do_Not_Call"}
            onClick={() => onPhoneOutOpen(lead)}
            size="sm"
          >
            <Phone size={16} />
            Call {lead.firstName}
            {callCount && callCount > 0 && (
              <Badge className=" rounded-full text-xs">{callCount}</Badge>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-2">
        <LeadSection
          label="Main"
          hint="Main Info"
          onEdit={() => onMainFormOpen(lead.id)}
        >
          <MainInfoClient
            info={leadMainInfo}
            noConvo={lead.conversation ? true : false}
            showEdit={false}
          />

          <CallInfo info={lead} showBtnCall={false} />
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
          onEdit={() => onGeneralFormOpen(lead.id)}
        >
          <GeneralInfoClient
            info={leadInfo}
            leadName={fullName}
            lastCall={lead?.calls[0]?.createdAt}
            nextAppointment={lead?.appointments[0]?.startDate}
            showInfo
            showEdit={false}
          />
        </LeadSection>
        <LeadSection label="Notes" hint="Notes">
          <NotesForm
            leadId={lead.id}
            intialNotes={lead.notes!}
            initSharedUser={lead.sharedUser}
          />
        </LeadSection>

        <LeadSection label="Policy" hint="Policy Info">
          <PolicyInfoClient
            leadId={lead.id}
            leadName={fullName}
            assistant={lead.assistant}
            info={leadPolicy}
          />
        </LeadSection>
      </div>
    </div>
  );
};
