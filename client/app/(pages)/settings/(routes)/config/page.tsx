import { currentRole } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LeadStatusClient } from "@/components/lead/status/client";
import { LicenseClient } from "./components/license/client";
import { CarrierClient } from "./components/carrier/client";
import { UserTemplateClient } from "./components/templates/client";
import { FacebookClient } from "./components/facebook/client";

const ConfigPage = async () => {
  const role = await currentRole();
  return (
    <Tabs
      className="flex flex-col lg:flex-row gap-2 item-start h-full"
      defaultValue="licenses"
    >
      <TabsList className="flex flex-col w-full lg:w-[120px] gap-2 h-full">
        <TabsTrigger className="w-full" value="licenses">
          Licenses
        </TabsTrigger>
        <TabsTrigger className="w-full" value="carriers">
          Carriers
        </TabsTrigger>
        <TabsTrigger className="w-full" value="leadStatus">
          Lead Status
        </TabsTrigger>
        <TabsTrigger className="w-full" value="templates">
          Templates
        </TabsTrigger>
        {["ADMIN", "MASTER"].includes(role as string) && (
          <TabsTrigger className="w-full" value="facebook">
            Facebook
          </TabsTrigger>
        )}
      </TabsList>
      <div className="flex-1">
        <TabsContent value="licenses">
          <LicenseClient />
        </TabsContent>
        <TabsContent value="carriers">
          <CarrierClient />
        </TabsContent>
        <TabsContent value="leadStatus">
          <LeadStatusClient />
        </TabsContent>
        <TabsContent value="templates">
          <UserTemplateClient />
        </TabsContent>
        {["ADMIN", "MASTER"].includes(role as string) && (
          <TabsContent value="facebook">
            <FacebookClient />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default ConfigPage;
