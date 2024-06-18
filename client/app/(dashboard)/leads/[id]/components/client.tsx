"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { FullLead } from "@/types";

import { formatPhoneNumber } from "@/formulas/phones";

import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { PolicyInfoClient } from "@/components/lead/policy-info";
import { CallInfo } from "@/components/lead/call-info";
import { MainInfoClient } from "@/components/lead/main-info";
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
    createdAt: lead.createdAt,
    updatedAt: lead.policy?.updatedAt!,
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
    <>
      {/*DATA  */}
      <div className="grid grid-cols-1 lg:grid-cols-5 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 col-span-3 gap-2">
          <MainInfoClient
            info={leadMainInfo}
            noConvo={lead.conversation?.id ? true : false}
          />
          <NotesForm
            leadId={lead.id}
            intialNotes={lead.notes!}
            initSharedUser={lead.sharedUser}
          />
          <CallInfo info={lead} />
        </div>
        <div className="flex flex-col lg:flex-row justify-around col-span-2 mb-2">
          <GeneralInfoClient info={leadInfo} showInfo />
          <PolicyInfoClient
            leadId={lead.id}
            leadName={leadName}
            assistant={lead.assistant}
            info={leadPolicy}
          />
        </div>
      </div>
      <div className="text-sm font-light px-4">
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
    </>
  );
};
