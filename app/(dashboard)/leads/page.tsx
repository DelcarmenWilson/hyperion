import { Users } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DashBoardTable } from "../dashboard/components/dashboard-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadClient } from "./components/client";

import { leadsGetAllByAgentId } from "@/data/lead";
import { LeadColumn, columns } from "./components/columns";
const LeadsPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);

  const formattedLeads: LeadColumn[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    notes: lead.notes as string,
    createdAt: lead.createdAt,
  }));

  return (
    <>
      <LeadClient leads={formattedLeads} />
    </>
  );
};

export default LeadsPage;
