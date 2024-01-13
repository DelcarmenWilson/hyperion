import { LeadGetById } from "@/data/lead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LeadForm } from "./_components/lead-form";
interface LeadsPageProps {
  params: {
    id: string;
  };
}
const LeadsPage = async ({ params }: LeadsPageProps) => {
  const { id } = params;
  const lead = await LeadGetById(id);
  return (
    <div className="py-4">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <LeadForm lead={lead} />
        </TabsContent>
        <TabsContent value="medical">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsPage;
