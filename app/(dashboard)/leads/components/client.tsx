"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { useGlobalContext } from "@/providers/global-provider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<<<<<<< HEAD
import { DataTableHeadless } from "@/components/tables/data-table-headless";
import { PageLayout } from "@/components/custom/page-layout";
import { DrawerRight } from "@/components/custom/drawer-right";
import { NewLeadForm } from "./new-lead-form";

import { TopMenu } from "./top-menu";
import { columns } from "./columns";
import { FullLead } from "@/types";
=======
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
import { verify } from "crypto";
>>>>>>> parent of 9f16759 (sales-pipeline)
import { allVendors } from "@/constants/lead";

interface LeadClientProps {
  leads: FullLead[];
}
export const LeadClient = ({ leads }: LeadClientProps) => {
  const { leadStatus } = useGlobalContext();
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].status : "New"
  );
  const [vendor, setVendor] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentLeads, setCurrentLeads] = useState(
    leads.filter((e) => e.status == status)
  );
  const onSetStatus = (st: string) => {
    setStatus(st);
    if (vendor == "All") setCurrentLeads(leads.filter((e) => e.status == st));
    else
      setCurrentLeads(
        leads.filter((e) => e.status == st && e.vendor == vendor)
      );
  };
  const onSetVendor = (vd: string) => {
    setVendor(vd);
    if (vd == "All") setCurrentLeads(leads.filter((e) => e.status == status));
    else
      setCurrentLeads(
        leads.filter((e) => e.status == status && e.vendor == vd)
      );
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
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Vendor</p>
            <Select
              name="ddlVendor"
              defaultValue={vendor}
              onValueChange={onSetVendor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {allVendors.map((vendor) => (
                  <SelectItem key={vendor.name} value={vendor.value}>
                    {vendor.name}
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
