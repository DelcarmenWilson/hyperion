"use client";
import { FullLead } from "@/types";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { DataTable } from "@/components/tables/data-table";

import { columns } from "./columns";
import axios from "axios";
import { ShareForm } from "@/components/lead/forms/share-form";
import { TransferForm } from "@/components/lead/forms/transfer-form";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";

export const LeadClient = ({ initLeads }: { initLeads: FullLead[] }) => {
  const [leads, setLeads] = useState(initLeads);

  useEffect(() => {
    const onSetLeads = (leadId: string) => {
      setLeads((lds) => lds.filter((e) => e.id != leadId));
    };

    const onSetNewLead = async (leadId: string) => {
      const response = await axios.post("/api/leads/details/by-id", {
        leadId: leadId,
      });
      const lead = response.data;
      console.log(lead);
      setLeads((lds) => [lead, ...lds]);
    };

    userEmitter.on("leadTransfered", onSetLeads);
    userEmitter.on("leadTransferedRecieved", onSetNewLead);
  }, []);
  return (
    <>
      <ShareForm />
      <TransferForm />
      <IntakeForm />
      <DataTable
        columns={columns}
        data={leads}
        striped
        hidden={{
          firstName: false,
          lastName: false,
          cellPhone: false,
          email: false,
          status: false,
          vendor: false,
          state: false,
        }}
        headers
        placeHolder="Search First | Last | Phone | Email"
        paginationType="advance"
        filterType="lead"
      />
    </>
  );
};
