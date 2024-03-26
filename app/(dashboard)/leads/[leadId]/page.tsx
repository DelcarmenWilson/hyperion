import { User } from "lucide-react";
import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
// import { conversationGetByLeadId } from "@/data/conversation";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopMenu } from "./components/top-menu";
import { LeadTabsClient } from "./components/tabs-client";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";
import { ConditionsClient } from "@/components/lead/conditions/client";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  if (!lead) return null;
  const prevNext = await leadGetPrevNextById(params.leadId, lead.userId);
  // const conversation = await conversationGetByLeadId(params.leadId);
  return (
    <PageLayout
      icon={User}
      title={`View Lead - ${lead.firstName}`}
      topMenu={<TopMenu nextPrev={prevNext} />}
    >
      <Tabs defaultValue="general" className="h-full">
        <p className="text-center font-semibold text-primary text-3xl">
          {lead.firstName} {lead.lastName}
        </p>
        <TabsList className="flex flex-col lg:flex-row w-full h-auto">
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
          <BeneficiariesClient
            leadId={lead.id}
            initBeneficiaries={lead.beneficiaries}
          />
        </TabsContent>
        <TabsContent value="conditions">
          <ConditionsClient leadId={lead.id} initConditions={lead.conditions} />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpensesClient leadId={lead.id} initExpenses={lead.expenses} />
        </TabsContent>
        <TabsContent value="activity">
          <LeadTabsClient lead={lead} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LeadsPage;
