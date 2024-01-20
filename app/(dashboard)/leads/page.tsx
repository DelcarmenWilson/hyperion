import { leadsGetAllByAgentId } from "@/data/lead";
import { LeadColumn, columns } from "./components/columns";
import { LeadClient } from "./components/client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DownloadCloud, Paperclip, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { DashBoardTable } from "../dashboard/components/dashboard-tables";
import { ScrollArea } from "@/components/ui/scroll-area";
const LeadsPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);

  const formattedLeads: LeadColumn[] = leads.map((lead) => ({
    id: lead.id,
    fullName: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    cellPhone: lead.cellPhone,
  }));

  return (
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
        <div className="flex gap-2 mr-6">
          <Button variant="outlineprimary" size="sm">
            <DownloadCloud className="h-4 w-4 mr-2" />
            GENERATE CSV
          </Button>
          <Button variant="outlineprimary" size="sm">
            <Paperclip className="h-4 w-4 mr-2" />
            UPLOAD CSV FILE
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            CREATE LEAD
          </Button>
        </div>
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
  );
};

export default LeadsPage;
