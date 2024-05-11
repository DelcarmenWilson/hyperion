import Link from "next/link";

import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { CarrierClient } from "./components/carrier/client";
import { LeadStatusClient } from "./components/leadstatus/client";
import { MedicalClient } from "./components/medical/client";
import { QuoteClient } from "./components/quote/client";

import {
  adminCarriersGetAll,
  adminLeadStatusGetAll,
  adminMedicalConditionsGetAll,
  adminQuotesGetAll,
} from "@/data/admin";

const PageSettings = async () => {
  const carriers = await adminCarriersGetAll();
  const leadstatus = await adminLeadStatusGetAll();
  const medical = await adminMedicalConditionsGetAll();
  const quotes = await adminQuotesGetAll();
  return (
    <PageLayoutAdmin
      title="Page Settings"
      description=""
      topMenu={
        <Button variant="outlineprimary" asChild>
          <Link href="/test" target="_blank">
            Landing page sample
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="carriers" className="mx-2">
        <TabsList className="flex w-full">
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="leadStatus">Lead Status</TabsTrigger>
          <TabsTrigger value="medical">Conditions</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
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
            <QuoteClient initQuotes={quotes} />
          </TabsContent>
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default PageSettings;
