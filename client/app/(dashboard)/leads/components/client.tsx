"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { userEmitter } from "@/lib/event-emmiter";
import { FullLead } from "@/types";
import { DataTable } from "@/components/tables/data-table";

import { columns } from "./columns";
import { ShareForm } from "@/components/lead/forms/share-form";
import { TransferForm } from "@/components/lead/forms/transfer-form";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";
import { AssistantForm } from "@/components/lead/forms/assistant-form";

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
      <AssistantForm />
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
