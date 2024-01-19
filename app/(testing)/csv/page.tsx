import { leadsGetAll } from "@/data/lead";
import React from "react";

const CvsPage = async () => {
  const data = await leadsGetAll();
  return <div>CvsPage</div>;
};

export default CvsPage;
