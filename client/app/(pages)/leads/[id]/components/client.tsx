"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { FullLead } from "@/types";

import { formatPhoneNumber } from "@/formulas/phones";

import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/info/general-info";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import { CallInfo } from "@/components/lead/info/call-info";
import { MainInfoClient } from "@/components/lead/info/main-info";
import { NotesForm } from "@/components/lead/forms/notes-form";

import { PhoneSwitcher } from "@/components/phone/addins/switcher";

import { leadUpdateByIdDefaultNumber } from "@/actions/lead";
import {
  LeadGeneralSchemaType,
  LeadMainSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";

type LeadClientProps = {
  lead: FullLead;
};

export const LeadClient = ({ lead }: LeadClientProps) => {
  const [edit, setEdit] = useState(false);
  const leadName = `${lead.firstName} ${lead.lastName}`;
  const [defaultNumber, setDefaultNumber] = useState(lead.defaultNumber);

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
    id: lead.id,
    gender: lead.gender,
    maritalStatus: lead.maritalStatus,
    dateOfBirth: lead.dateOfBirth || undefined,
    weight: lead.weight || undefined,
    height: lead.height || undefined,
    income: lead.income || undefined,
    smoker: lead.smoker,
    leadName: leadName,
    lastCall: lead?.calls[0]?.createdAt,
    nextAppointment: lead?.appointments[0]?.startDate,
  };

  const leadPolicy: LeadPolicySchemaType = {
    leadId: lead.id,
    carrier: lead.policy?.carrier!,
    policyNumber: lead.policy?.policyNumber!,
    status: lead.policy?.status!,
    ap: lead.policy?.ap!,
    commision: lead.policy?.commision!,
    coverageAmount: lead.policy?.coverageAmount!,
    startDate: lead.policy?.startDate!,
  };

  const onSetDefaultNumber = async (phoneNumber: string) => {
    if (phoneNumber != defaultNumber) {
      setDefaultNumber(phoneNumber);
      const updatedNumber = await leadUpdateByIdDefaultNumber(
        lead.id,
        phoneNumber
      );

      if (updatedNumber.success) {
        toast.success(updatedNumber.success);
      } else toast.error(updatedNumber.error);
    }
    setEdit(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <MainInfoClient
        info={leadMainInfo}
        noConvo={lead.conversation ? true : false}
      />
      <GeneralInfoClient info={leadInfo} showInfo />
      <CallInfo info={lead} />
      <NotesForm
        leadId={lead.id}
        intialNotes={lead.notes!}
        initSharedUser={lead.sharedUser}
      />

      <PolicyInfoClient
        leadId={lead.id}
        leadName={leadName}
        assistant={lead.assistant}
        info={leadPolicy}
      />
      <div></div>
      <div className="text-sm font-light col-span-2 px-4">
        <p>Lead Phone Number</p>
        <p>
          -Type: <span className="font-bold">unknown</span>
        </p>
        <div className="flex items-center gap-2 group">
          <span>Caller Id for calls /texts</span>
          {edit ? (
            <PhoneSwitcher
              number={defaultNumber}
              onSetDefaultNumber={onSetDefaultNumber}
              controls
            />
          ) : (
            <>
              <span className="font-bold">
                {formatPhoneNumber(defaultNumber)}
              </span>
              <Button
                className="opacity-0 group-hover:opacity-100"
                variant="link"
                size="sm"
                onClick={() => setEdit(true)}
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
