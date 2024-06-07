"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PolicyInfoClient } from "@/components/lead/policy-info";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { CallInfo } from "@/components/lead/call-info";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";

import {
  LeadMainInfo,
  LeadGeneralInfo,
  LeadPolicyInfo,
  FullLeadNoConvo,
} from "@/types";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { ScrollArea } from "@/components/ui/scroll-area";

type ConversationLeadInfoProps = {
  lead: FullLeadNoConvo;
  size?: string;
};
export const ConversationLeadInfo = ({
  lead,
  size = "full",
}: ConversationLeadInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
  const leadMainInfo: LeadMainInfo = {
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

  const leadInfo: LeadGeneralInfo = {
    id: lead.id,
    gender: lead.gender,
    maritalStatus: lead.maritalStatus,
    dateOfBirth: lead.dateOfBirth || undefined,
    weight: lead.weight || undefined,
    height: lead.height || undefined,
    income: lead.income || undefined,
    smoker: lead.smoker,
    leadName: leadName,
  };

  const leadPolicy: LeadPolicyInfo = {
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
    <div
      className={cn(
        "flex flex-col relative transition-[right] -right-full ease-in-out duration-100 w-0 h-full overflow-hidden",
        isOpen && "w-[250px] right-0"
      )}
    >
      <Tabs defaultValue="general" className="flex flex-col flex-1 h-full">
        <h4 className="text-center text-2xl text-primary bg-secondary font-bold ">
          {lead.firstName} {lead.lastName}
        </h4>

        <TabsList className="flex flex-wrap w-full h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <ScrollArea className="pe-3">
          <TabsContent value="general">
            <div
              className={cn(
                "grid  gap-2 p-2",
                size == "full" ? "grid-cols-3" : "grid-cols-1"
              )}
            >
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
            <BeneficiariesClient leadId={lead.id} size="sm" />
          </TabsContent>
          <TabsContent value="conditions">
            <ConditionsClient leadId={lead.id} size="sm" />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesClient leadId={lead.id} size="sm" />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
