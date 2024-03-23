import { leadStatusGetAllByAgentId } from "@/data/lead";
import { currentUser } from "@/lib/auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadStatusClient } from "@/components/lead/status/client";
import { LicenseClient } from "./components/license/client";

import {
  userCarriersGetAllByUserId,
  userLicensesGetAllByUserId,
} from "@/data/user";
import { CarrierClient } from "./components/carrier/client";
import { adminCarriersGetAll } from "@/data/admin";

const ConfigPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const licenses = await userLicensesGetAllByUserId(user.id, user.role);
  const leadStatus = await leadStatusGetAllByAgentId(user.id, user.role);
  const userCarriers = await userCarriersGetAllByUserId(user.id, user.role);
  const carriers = await adminCarriersGetAll();

  return (
    <Tabs className="flex gap-2 item-start h-full" defaultValue="licenses">
      <TabsList className="flex flex-col w-[120px] gap-2 h-full">
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
          <LicenseClient initLicenses={licenses} role={user.role} />
        </TabsContent>
        <TabsContent value="carriers">
          <CarrierClient
            initUserCarriers={userCarriers}
            initCarriers={carriers}
            role={user.role}
          />
        </TabsContent>
        <TabsContent value="leadStatus">
          <LeadStatusClient leadStatus={leadStatus} role={user.role} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ConfigPage;
