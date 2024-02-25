import { leadStatusGetAllByAgentId } from "@/data/lead";
import { currentUser } from "@/lib/auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadStatusBox } from "@/components/lead/lead-status";
import { LicenseForm } from "./components/license-form";

import { userLicensesGetAllByUserId } from "@/data/user";

const ConfigPage = async () => {
  const user = await currentUser();
  const licenses = await userLicensesGetAllByUserId(user?.id!);
  const leadStatus = await leadStatusGetAllByAgentId(user?.id!);
  return (
    <Tabs className="flex gap-2 item-start h-full" defaultValue="licenses">
      <TabsList className="flex flex-col w-[120px] gap-2  h-full">
        <TabsTrigger className="w-full" value="licenses">
          Licenses
        </TabsTrigger>
        <TabsTrigger className="w-full" value="carriers">
          Carriers
        </TabsTrigger>
        <TabsTrigger className="w-full" value="leadStatus">
          Lead Status
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="licenses">
          <LicenseForm initLicenses={licenses} />
        </TabsContent>
        <TabsContent value="carriers">SMS (Future Update)</TabsContent>
        <TabsContent value="leadStatus">
          <LeadStatusBox leadStatus={leadStatus} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ConfigPage;
