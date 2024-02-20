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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { FullLead } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";
import { NewLeadForm } from "./new-lead-form";
import { DataTableHeadless } from "@/components/tables/data-table-headless";
import { CardLayout } from "@/components/custom/card-layout";
import { TopMenu } from "./top-menu";
import { PageLayout } from "@/components/custom/page-layout";
import { usePhoneContext } from "@/providers/phone-provider";

interface LeadClientProps {
  leads: FullLead[];
}
export const LeadClient = ({ leads }: LeadClientProps) => {
  const { leadStatus } = usePhoneContext();
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].status : "New"
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentLeads, setCurrentLeads] = useState(
    leads.filter((e) => e.status == status)
  );
  const onSetStatus = (st: string) => {
    setStatus(st);
    setCurrentLeads(leads.filter((e) => e.status == st));
  };
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
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Status</p>

            <Select
              name="ddlStatus"
              onValueChange={onSetStatus}
              defaultValue={status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status a Team" />
              </SelectTrigger>
              <SelectContent>
                {leadStatus?.map((status) => (
                  <SelectItem key={status.id} value={status.status}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTableHeadless
          columns={columns}
          data={currentLeads}
          searchKey="lastName"
        />
      </PageLayout>
    </>
  );
};
