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

import { DataTableHeadless } from "@/components/tables/data-table-headless";
import { PageLayout } from "@/components/custom/page-layout";
import { DrawerRight } from "@/components/custom/drawer-right";
import { NewLeadForm } from "./new-lead-form";

import { TopMenu } from "./top-menu";
import { columns } from "./columns";
import { FullLead } from "@/types";
import { allVendors } from "@/constants/lead";
import { states } from "@/constants/states";

interface LeadClientProps {
  leads: FullLead[];
}
export const LeadClient = ({ leads }: LeadClientProps) => {
  const { leadStatus } = useGlobalContext();
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].status : "New"
  );
  const [vendor, setVendor] = useState("%");
  const [state, setState] = useState("%");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentLeads, setCurrentLeads] = useState(
    leads.filter((e) => e.status.includes(status))
  );

  const uniqueStates = [...new Set(leads.map((item) => item.state))];
  const myStates = states.filter((e) => uniqueStates.includes(e.abv)).sort();

  const onSetStatus = (st: string) => {
    setStatus(st);
    setCurrentLeads(
      leads.filter(
        (e) =>
          e.status.includes(st == "%" ? "" : st) &&
          e.vendor.includes(vendor == "%" ? "" : vendor) &&
          e.state.includes(state == "%" ? "" : state)
      )
    );
  };
  const onSetVendor = (vd: string) => {
    setVendor(vd);
    setCurrentLeads(
      leads.filter(
        (e) =>
          e.status.includes(status == "%" ? "" : status) &&
          e.vendor.includes(vd == "%" ? "" : vd) &&
          e.state.includes(state == "%" ? "" : state)
      )
    );
  };
  const onSetState = (st: string) => {
    setState(st);
    setCurrentLeads(
      leads.filter(
        (e) =>
          e.status.includes(status == "%" ? "" : status) &&
          e.vendor.includes(vendor == "%" ? "" : vendor) &&
          e.state.includes(st == "%" ? "" : st)
      )
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
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Status</p>
            <Select
              name="ddlStatus"
              onValueChange={onSetStatus}
              defaultValue={status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">All</SelectItem>
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
                <SelectItem value="%">All</SelectItem>
                {allVendors.map((vendor) => (
                  <SelectItem key={vendor.name} value={vendor.value}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">State</p>
            <Select
              name="ddlState"
              defaultValue={state}
              onValueChange={onSetState}
            >
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">All</SelectItem>
                {myStates.map((state) => (
                  <SelectItem key={state.state} value={state.abv}>
                    {state.state}
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
