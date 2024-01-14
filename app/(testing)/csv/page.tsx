import { LeadsGetAll } from "@/data/lead";
import React from "react";
import { LeadDataTable } from "../../(leads)/leads/components/lead-data-table";

const CvsPage = async () => {
  const data = await LeadsGetAll();
  return <div>CvsPage</div>;
};

export default CvsPage;
