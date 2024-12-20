"use client";
import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useLeadData, useLeadId } from "@/hooks/lead/use-lead";

import { PageLayout } from "@/components/custom/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ActivityClient } from "./components/activity-log/client";
import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { CommunicationClient } from "./components/communication/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { PrevNextMenu } from "@/components/lead/prev-next-menu";
import { capitalize } from "@/formulas/text";

const LeadsPage = () => {
  const user = useCurrentUser();
  const { leadId } = useLeadId();
  const { onGetLeadBasicInfo, onGetLeadPrevNext } = useLeadData();
  const { leadBasic } = onGetLeadBasicInfo(leadId);
  const { prevNext, nextPrevFetching } = onGetLeadPrevNext(leadId);

  if (!leadBasic || !leadId) return null;

  if (![leadBasic.userId, leadBasic.sharedUserId].includes(user?.id!)) {
    redirect("/leads");
  }
  return (
    <PageLayout
      icon={User}
      title={`View Lead - ${leadBasic.firstName}`}
      topMenu={
        <SkeletonWrapper isLoading={nextPrevFetching}>
          <PrevNextMenu href="leads" btnText="lead" prevNext={prevNext!} />
        </SkeletonWrapper>
      }
      cardClass="h-full !rounded-l-none"
      contentClass="!p-1 flex"
      scroll={false}
    >
      <Tabs
        defaultValue="comunication"
        className="flex flex-col flex-1 h-full overflow-hidden"
      >
        <TabsList className="flex flex-col md:flex-row w-full h-auto rounded-none bg-primary/25">
          {[
            "comunication",
            "activity",
            "beneficiaries",
            "conditions",
            "expenses",
          ].map((trigger) => (
            <TabsTrigger key={trigger} value={trigger}>
              {capitalize(trigger)}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1 h-full overflow-hidden">
          <TabsContent value="comunication" className="h-full overflow-hidden">
            <CommunicationClient />
          </TabsContent>
          <TabsContent value="activity" className="h-full">
            <ActivityClient />
          </TabsContent>
          <TabsContent value="beneficiaries" className="h-full">
            <BeneficiariesClient leadId={leadId} />
          </TabsContent>
          <TabsContent value="conditions" className="h-full">
            <ConditionsClient leadId={leadId} />
          </TabsContent>
          <TabsContent value="expenses" className="h-full">
            <ExpensesClient leadId={leadId} />
          </TabsContent>
        </div>
      </Tabs>
    </PageLayout>
  );
};

export default LeadsPage;
