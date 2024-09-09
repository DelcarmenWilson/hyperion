import { User } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/custom/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadTabsClient } from "./components/tabs-client";
import { LeadClient } from "./components/client";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";
import { PrevNextMenu } from "@/components/lead/prev-next-menu";
import { ConditionsClient } from "@/components/lead/conditions/client";

import { LeadHeader } from "@/components/lead/header";
import { AssistantForm } from "@/components/lead/forms/assistant-form";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";
import { PolicyInfoForm } from "@/components/lead/forms/policy-info-form";
import { ShareForm } from "@/components/lead/forms/share-form";
import { TransferForm } from "@/components/lead/forms/transfer-form";
import { leadGetById, leadGetPrevNextById } from "@/actions/lead";

const LeadsPage = async ({ params }: { params: { id: string } }) => {
  const lead = await leadGetById(params.id);
  const user = await currentUser();
  if (!lead) return null;

  if (![lead.userId, lead.sharedUserId].includes(user?.id!)) {
    redirect("/leads");
  }
  const prevNext = await leadGetPrevNextById(params.id);
  return (
    <PageLayout
      icon={User}
      title={`View Lead - ${lead.firstName}`}
      topMenu={
        <PrevNextMenu href="leads" btnText="lead" prevNext={prevNext!} />
      }
    >
      <Tabs defaultValue="general" className="h-full">
        <LeadHeader lead={lead} />
        <PolicyInfoForm />
        <ShareForm />
        <TransferForm />
        <IntakeForm />
        <AssistantForm />
        <TabsList className="flex flex-col md:flex-row w-full h-auto rounded-none">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <LeadClient lead={lead} />
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
        <TabsContent value="activity">
          <LeadTabsClient lead={lead} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LeadsPage;
