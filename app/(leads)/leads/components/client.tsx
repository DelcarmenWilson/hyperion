"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LeadColumn, columns } from "./columns";
import { LeadDataTable } from "./lead-data-table";
import { sendIntialSms } from "@/actions/sms";
import { toast } from "sonner";
import { ApiLeadList } from "./api-list";

interface LeadClientProps {
  data: LeadColumn[];
}
export const LeadClient = ({ data }: LeadClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Leads (${data.length})`} description="Manage Leads" />
        <Button onClick={() => router.push(`/leads/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <LeadDataTable searchKey="firstName" columns={columns} data={data} />
      <Heading title="API" description="API calls for Leads" />
      <Separator />
      <ApiLeadList entityName="leads" entityIdName="leadId" />
    </>
  );
};
