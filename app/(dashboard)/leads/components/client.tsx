"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DownloadCloud, Paperclip, Plus, Users } from "lucide-react";
import { ImportLeadsForm } from "./import/import-leads-form";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { FullLead } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";
import { NewLeadForm } from "./new-lead-form";
import { DataTableHeadless } from "@/components/tables/data-table-headless";
import { CardLayout } from "@/components/custom/card-layout";
import { TopMenu } from "./top-menu";
import { PageLayout } from "@/components/custom/page-layout";

interface LeadClientProps {
  leads: FullLead[];
}
export const LeadClient = ({ leads }: LeadClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <DrawerRight
        title="New Lead"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <NewLeadForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      <PageLayout
        title="View Leads"
        icon={Users}
        topMenu={<TopMenu setIsOpen={setIsDrawerOpen} />}
      >
        <DataTableHeadless
          columns={columns}
          data={leads}
          searchKey="lastName"
        />
      </PageLayout>
    </>
  );
};
