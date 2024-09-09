"use client";
import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadData } from "@/hooks/use-lead";

import { PageLayout } from "@/components/custom/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ActivityClient } from "./components/activity-log/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { CommunicationClient } from "./components/communication/client";

import { PrevNextMenu } from "@/components/lead/prev-next-menu";

const LeadsPage = () => {
  const user = useCurrentUser();
  const { lead, prevNext, isFetchingnextPrev } = useLeadData();
  if (!lead) return null;

  if (![lead.userId, lead.sharedUserId].includes(user?.id!)) {
    redirect("/leads");
  }
  return (
    <PageLayout
      icon={User}
      title={`View Lead - ${lead.firstName}`}
      topMenu={
        <PrevNextMenu href="leads" btnText="lead" prevNext={prevNext!} />
      }
      cardClass="h-full"
      contentClass="!p-1"
    >
      <Tabs defaultValue="activity" className="h-full">
        <TabsList className="flex flex-col md:flex-row w-full h-auto rounded-none">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="comunication">Comunication</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <ActivityClient />
        </TabsContent>
        <TabsContent value="comunication">
          <CommunicationClient />
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
    </PageLayout>
  );
};

export default LeadsPage;
