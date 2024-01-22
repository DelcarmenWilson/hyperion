import { Users } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DashBoardTable } from "../dashboard/components/dashboard-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadClient } from "./components/client";

import { leadsGetAllByAgentId } from "@/data/lead";
import { LeadColumn, columns } from "./components/columns";
const LeadsPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);

  const formattedLeads: LeadColumn[] = leads.map((lead) => ({
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    notes: lead.notes as string,
    createdAt: lead.createdAt,
  }));

  return (
    <>
      <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-4 rounded-br-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className=" text-sm text-muted-foreground">
              View Leads
            </CardTitle>
          </div>
          <LeadClient />
        </div>

        <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2">
          <ScrollArea className="w-full flex-1 h-[400px]">
            <DashBoardTable
              columns={columns}
              data={formattedLeads}
              searchKey="fullName"
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

export default LeadsPage;
