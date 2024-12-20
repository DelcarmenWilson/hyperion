import Link from "next/link";

import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { CarrierClient } from "./components/carrier/client";
import { LeadStatusClient } from "./components/leadstatus/client";
import { MedicalClient } from "./components/medical/client";
import QuoteClient from "./components/quote/client";
import UpdateClient from "./components/update/client";

import { adminCarriersGetAll } from "@/actions/admin/carrier";
import { adminLeadStatusGetAll } from "@/actions/admin/lead";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";
import { pageUpdatesGetAll } from "@/actions/admin/page-update";

const PageSettings = async () => {
  const carriers = await adminCarriersGetAll();
  const leadstatus = await adminLeadStatusGetAll();
  const medical = await adminMedicalConditionsGetAll();
  return (
    <PageLayoutAdmin
      title="Page Settings"
      description=""
      topMenu={
        <Button variant="outlineprimary" asChild>
          <Link href="/landing/xero" target="_blank">
            Landing page sample
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="updates" className="mx-2">
        <TabsList className="flex w-full">
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="leadStatus">Lead Status</TabsTrigger>
          <TabsTrigger value="medical">Conditions</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>
        <div className="px-2">
          <TabsContent value="carriers">
            <CarrierClient initCarriers={carriers} />
          </TabsContent>

          <TabsContent value="leadStatus">
            <LeadStatusClient initStatus={leadstatus} />
          </TabsContent>
          <TabsContent value="medical">
            <MedicalClient initMedicals={medical} />
          </TabsContent>
          <TabsContent value="quotes">
            <QuoteClient />
          </TabsContent>
          <TabsContent value="updates">
            <UpdateClient />
          </TabsContent>
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default PageSettings;
