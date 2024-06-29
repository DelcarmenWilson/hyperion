"use client";

import { useEffect, useState } from "react";
import { usePhone } from "@/hooks/use-phone";
import { userEmitter } from "@/lib/event-emmiter";

import { cn } from "@/lib/utils";

import {
  LeadGeneralSchemaType,
  LeadMainSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PolicyInfoClient } from "@/components/lead/policy-info";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { CallInfo } from "@/components/lead/call-info";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";

import { PhoneScript } from "./script";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { LeadHeader } from "@/components/lead/header";

type PhoneLeadInfo = {
  open?: boolean;
};

export const PhoneLeadInfo = ({ open = false }: PhoneLeadInfo) => {
  const { lead } = usePhone();
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    userEmitter.on("toggleLeadInfo", (open) => setIsOpen(open));
    return () => {
      userEmitter.off("toggleLeadInfo", (open) => setIsOpen(open));
    };
  }, []);

  if (!lead) {
    return null;
  }
  const leadName = `${lead.firstName} ${lead.lastName}`;
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
    textCode: lead.textCode as string,
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
    lastCall: lead.calls ? lead.calls[0]?.createdAt : undefined,
    nextAppointment: lead.appointments
      ? lead.appointments[0]?.startDate
      : undefined,
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
    createdAt: lead.policy?.createdAt!,
    updatedAt: lead.policy?.updatedAt!,
  };
  return (
    <div className="flex flex-1 justify-start relative overflow-hidden">
      <div
        className={cn(
          "flex  flex-col relative transition-[right] -right-full ease-in-out duration-500 h-full w-0 overflow-hidden",
          isOpen && "w-full right-0"
        )}
      >
        <Tabs defaultValue="general" className="flex flex-col flex-1 h-full">
          <LeadHeader lead={lead} />
          <TabsList className="flex w-full h-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent
            className="flex-1 overflow-hidden overflow-y-auto"
            value="general"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2">
              <MainInfoClient info={leadMainInfo} noConvo={false} />
              <GeneralInfoClient info={leadInfo} showInfo />
              <CallInfo info={lead!} showBtnCall={false} />
              <PolicyInfoClient
                leadId={lead.id}
                leadName={leadName}
                info={leadPolicy}
                assistant={lead.assistant}
              />
              <NotesForm
                leadId={lead?.id as string}
                intialNotes={lead?.notes as string}
                initSharedUser={lead.sharedUser}
              />
            </div>
          </TabsContent>
          <TabsContent value="beneficiaries">
            <BeneficiariesClient leadId={lead.id} />
          </TabsContent>
          <TabsContent value="conditions">
            <ConditionsClient leadId={lead.id} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesClient leadId={lead.id} />
          </TabsContent>
        </Tabs>

        <PhoneScript />
      </div>
    </div>
  );
};
