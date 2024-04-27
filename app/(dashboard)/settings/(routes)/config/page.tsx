import { currentUser } from "@/lib/auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadStatusClient } from "@/components/lead/status/client";
import { LicenseClient } from "./components/license/client";
import { CarrierClient } from "./components/carrier/client";

import { NotificationClient } from "./components/notifications/client";
import { notificationSettingsGetByUserId } from "@/data/notification-settings";
import { UserTemplateClient } from "./components/templates/client";

import { adminCarriersGetAll } from "@/data/admin";
const ConfigPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const carriers = await adminCarriersGetAll();

  const notificationSettings = await notificationSettingsGetByUserId(user.id);

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
        <TabsTrigger className="w-full" value="notifications">
          Notifications
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="licenses">
          <LicenseClient />
        </TabsContent>
        <TabsContent value="carriers">
          <CarrierClient adminCarriers={carriers} />
        </TabsContent>
        <TabsContent value="leadStatus">
          <LeadStatusClient />
        </TabsContent>
        <TabsContent value="templates">
          <UserTemplateClient />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationClient notificationSettings={notificationSettings!} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ConfigPage;
