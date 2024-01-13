import { LeadsGetAll } from "@/data/lead";
import { LeadDataTable } from "../_components/lead-data-table";

const LeadsPage = async () => {
  const data = await LeadsGetAll();

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center py-2">My Leads</h2>      
      <LeadDataTable data={data}/>
    </div>
  );
};

export default LeadsPage;
