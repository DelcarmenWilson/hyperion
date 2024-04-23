"use client";

import { useState } from "react";
import { usePhone } from "@/hooks/use-phone";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import { DropDown } from "@/components/lead/dropdown";
import { SaleInfoClient } from "@/components/lead/sale-info";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { CallInfo } from "@/components/lead/call-info";
import { NotesForm } from "@/components/lead/notes-form";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";

import { PhoneScript } from "./script";
import { LeadMainInfo, LeadGeneralInfo, LeadSaleInfo } from "@/types";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { useCurrentRole } from "@/hooks/user-current-role";

type PhoneLeadInfo = {
  open?: boolean;
};
export const PhoneLeadInfo = ({ open = false }: PhoneLeadInfo) => {
  const { lead } = usePhone();
  const role = useCurrentRole();
  const [isOpen, setIsOpen] = useState(open);

  if (!lead) {
    return null;
  }
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
  };

  const leadSale: LeadSaleInfo = {
    id: lead.id,
    createdAt: lead.createdAt,
    vendor: lead.vendor,
    ap: lead.ap,
    commision: lead.commision,
    coverageAmount: lead.coverageAmount,
    carrier: lead.carrier,
  };
  return (
    <div className="flex flex-1 justify-start relative overflow-hidden">
      {!open && (
        <div className="flex items-center justify-center w-[44px] h-full overflow-hidden relative px-2">
          <Button
            className="rotate-90"
            variant={isOpen ? "default" : "outline"}
            onClick={() => setIsOpen(!isOpen)}
          >
            Lead Info
          </Button>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col relative transition-[right] -right-full ease-in-out duration-100 w-0 h-full overflow-hidden",
          isOpen && "w-full right-0"
        )}
      >
        <Tabs defaultValue="general" className="flex flex-col flex-1 h-full">
          <h3 className="text-center text-2xl bg-secondary font-bold ">
            <span className="text-primary">
              {lead.firstName} {lead.lastName}
            </span>
            {" | "}
            <span className="italic text-muted-foreground mr-2">
              {lead.gender.substring(0, 1)} {lead.maritalStatus}
            </span>
            <DropDown lead={lead} />
          </h3>
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
            <div className="grid grid-cols-3 gap-2 p-2">
              <MainInfoClient info={leadMainInfo} noConvo={false} />
              <GeneralInfoClient info={leadInfo} showInfo />
              <CallInfo info={lead!} showBtnCall={false} />
              <SaleInfoClient info={leadSale} />
              <NotesForm
                leadId={lead?.id as string}
                intialNotes={lead?.notes as string}
              />
            </div>
          </TabsContent>
          <TabsContent value="beneficiaries">
            <BeneficiariesClient
              leadId={lead.id}
              initBeneficiaries={lead.beneficiaries!}
            />
          </TabsContent>
          <TabsContent value="conditions">
            <ConditionsClient
              leadId={lead.id}
              initConditions={lead.conditions!}
            />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesClient leadId={lead.id} initExpenses={lead.expenses!} />
          </TabsContent>
        </Tabs>

        {/* {!open && <PhoneScript />} */}
        <PhoneScript />
      </div>
    </div>
  );
};
