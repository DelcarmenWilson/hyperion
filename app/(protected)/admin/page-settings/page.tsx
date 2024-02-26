import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CarrierClient } from "./components/carrier/client";
import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import {
  adminCarriersGetAll,
  adminLeadStatusGetAll,
  adminMedicalConditionsGetAll,
} from "@/data/admin";
import { LeadStatusClient } from "./components/leadstatus/client";
import { MedicalClient } from "./components/medical/client";

const PageSettings = async () => {
  const carriers = await adminCarriersGetAll();
  const leadstatus = await adminLeadStatusGetAll();
  const medical = await adminMedicalConditionsGetAll();
  return (
    <PageLayoutAdmin title="Page Settings" description="">
      <Tabs defaultValue="carriers" className="pt-2">
        <TabsList>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="leadStatus">Lead Status</TabsTrigger>
          <TabsTrigger value="medical">Conditions</TabsTrigger>
        </TabsList>
        <div className="px-2">
          <TabsContent value="carriers">
            <CarrierClient initCarriers={carriers} />
          </TabsContent>

          <TabsContent value="leadStatus">
            <LeadStatusClient initStatus={leadstatus} />
          </TabsContent>
          <TabsContent value="medical">
            <MedicalClient initMedical={medical} />
          </TabsContent>
          {/* <TabsContent value="chatSettings">ChatSettingsBox</TabsContent> */}
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default PageSettings;
