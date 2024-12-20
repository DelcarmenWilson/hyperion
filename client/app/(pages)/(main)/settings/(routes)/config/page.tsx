import { currentRole } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LeadStatusClient } from "@/app/(pages)/(main)/settings/(routes)/config/components/status/client";
import { LicenseClient } from "./components/license/client";
import { CarrierClient } from "./components/carrier/client";
import { UserTemplateClient } from "./components/templates/client";
import { FacebookClient } from "./components/facebook/client";
import { ScriptClient } from "./components/script/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEVADMINS } from "@/constants/user";

const ConfigPage = async () => {
  const role = await currentRole();
  return (
    <Tabs
      className="flex flex-col lg:flex-row gap-2 item-start h-full"
      defaultValue="licenses"
    >
      <TabsList className="flex flex-col w-full lg:w-[120px] gap-2 justify-start  h-full">
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
        <TabsTrigger className="w-full" value="scripts">
          Scripts
        </TabsTrigger>

        {DEVADMINS.includes(role!) && (
          <TabsTrigger className="w-full" value="facebook">
            Facebook
          </TabsTrigger>
        )}
      </TabsList>
      {/* <ScrollArea className="flex-1 h-full"> */}
      <div className="flex-1 h-full">
        <TabsContent value="licenses" className="h-full">
          <ScrollArea>
            <LicenseClient />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="carriers" className="h-full">
          <ScrollArea>
            <CarrierClient />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="leadStatus" className="h-full">
          <ScrollArea>
            <LeadStatusClient />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="templates" className="h-full">
          <ScrollArea>
            <UserTemplateClient />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="scripts" className="h-full">
          <ScrollArea>
            <ScriptClient />
          </ScrollArea>
        </TabsContent>
        {DEVADMINS.includes(role!) && (
          <TabsContent value="facebook" className="h-full">
            <ScrollArea>
              <FacebookClient />
            </ScrollArea>
          </TabsContent>
        )}
      </div>
      {/* </ScrollArea> */}
    </Tabs>
  );
};

export default ConfigPage;
