import { LeadGetById } from "@/data/lead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadForm } from "./components/lead-form";
import { db } from "@/lib/db";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await LeadGetById(params.leadId);
  //const lead = await db.team.findUnique({ where: { id: "" } });
  return (
    <div className="py-4">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <LeadForm initialData={lead} />
        </TabsContent>
        <TabsContent value="medical">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsPage;
