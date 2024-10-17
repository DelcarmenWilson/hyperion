"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { MainInfoClient } from "@/components/lead/info/main";
import { CallInfo } from "@/components/lead/info/call";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";

import { PhoneScript } from "./script";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { LeadHeader } from "@/components/lead/header";

export const PhoneLeadInfo = () => {
  return (
    <div className="flex flex-col bg-background relative overflow-hidden h-full w-full">
      <Tabs defaultValue="general" className="flex flex-col flex-1 h-full">
        <LeadHeader />
        <TabsList className="flex w-full h-auto rounded-none">
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
            <MainInfoClient noConvo={false} />
            <GeneralInfoClient showInfo />
            <CallInfo showBtnCall={false} />
            <PolicyInfoClient />
            <NotesForm />
          </div>
        </TabsContent>
        <TabsContent
          value="beneficiaries"
          className="flex-1 overflow-y-auto data-[state=active]:h-full"
        >
          <BeneficiariesClient />
        </TabsContent>
        <TabsContent
          value="conditions"
          className="flex-1 overflow-y-auto data-[state=active]:h-full"
        >
          <ConditionsClient />
        </TabsContent>
        <TabsContent
          className="flex-1 overflow-y-auto data-[state=active]:h-full"
          value="expenses"
        >
          <ExpensesClient />
        </TabsContent>
      </Tabs>
      <PhoneScript />
    </div>
  );
};
