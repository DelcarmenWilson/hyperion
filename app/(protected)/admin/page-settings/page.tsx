"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarrierBox } from "./components/carrier-box";
import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { adminCarriersGetAll } from "@/data/admin";

const PageSettings = async () => {
  const carriers = await adminCarriersGetAll();
  return (
    <PageLayoutAdmin title="Page Settings" description="">
      <Tabs defaultValue="carriers" className="pt-2">
        <TabsList>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
        </TabsList>
        <div className="px-2">
          <TabsContent value="carriers">
            <CarrierBox initCarriers={carriers} />
          </TabsContent>
          {/* <TabsContent value="chatSettings">ChatSettingsBox</TabsContent> */}
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default PageSettings;
