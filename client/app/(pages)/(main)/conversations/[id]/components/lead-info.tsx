"use client";
import { cn } from "@/lib/utils";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadData } from "@/hooks/lead/use-lead";
import { useConversationStore } from "@/stores/conversation-store";

import { BeneficiariesClient } from "@/components/lead/beneficiaries/client";
import { CallInfo } from "@/components/lead/info/call";
import { ConditionsClient } from "@/components/lead/conditions/client";
import { ExpensesClient } from "@/components/lead/expenses/client";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { MainInfoClient } from "@/components/lead/info/main";
import { NotesForm } from "@/components/lead/forms/notes-form";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ConversationLeadInfo = ({ size = "full" }: { size?: string }) => {
  const { isLeadInfoOpen } = useConversationStore();
  const { leadId } = useLeadStore();
  const { onGetLeadBasicInfo } = useLeadData();
  const { leadBasic } = onGetLeadBasicInfo(leadId as string);

  if (!leadId) return null;
  return (
    <div
      className={cn(
        "flex flex-col relative transition-[right] -right-full ease-in-out duration-100 w-0 h-full overflow-hidden",
        isLeadInfoOpen && "w-[250px] right-0"
      )}
    >
      <Tabs defaultValue="general" className="flex flex-col flex-1 h-full">
        <h4 className="text-center text-2xl text-primary bg-secondary font-bold ">
          {leadBasic?.firstName} {leadBasic?.lastName}
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
              <MainInfoClient leadId={leadId} noConvo={false} />
              <GeneralInfoClient leadId={leadId} showInfo />
              <CallInfo leadId={leadId} showBtnCall={false} />
              <PolicyInfoClient leadId={leadId} />
              <NotesForm leadId={leadId} />
            </div>
          </TabsContent>
          <TabsContent value="beneficiaries">
            {/*TODO need to implement the sizes for all 3 clients */}
            <BeneficiariesClient leadId={leadId} size={size} />
          </TabsContent>
          <TabsContent value="conditions">
            <ConditionsClient leadId={leadId} size={size} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesClient leadId={leadId} size={size} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
