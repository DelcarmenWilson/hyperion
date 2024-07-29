"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { userEmitter } from "@/lib/event-emmiter";
import { FullLead } from "@/types";
import { DataTable } from "@/components/tables/data-table";

import { columns } from "./columns";
import { AssistantForm } from "@/components/lead/forms/assistant-form";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";
import { PolicyInfoForm } from "@/components/lead/forms/policy-info-form";
import { ShareForm } from "@/components/lead/forms/share-form";
import { TransferForm } from "@/components/lead/forms/transfer-form";

export const LeadClient = ({ initLeads }: { initLeads: FullLead[] }) => {
  const [leads, setLeads] = useState(initLeads);

  useEffect(() => {
    const onSetLeads = (leadIds: string[]) => {
      setLeads((lds) => lds.filter((e) => !leadIds.includes(e.id)));
    };

    const onSetNewLead = async (leadIds: string[]) => {
      const response = await axios.post("/api/leads/details/by-id", {
        leadId: leadIds[0],
      });
      const lead = response.data;
      setLeads((lds) => [lead, ...lds]);
    };

    userEmitter.on("leadTransfered", onSetLeads);
    userEmitter.on("leadTransferedRecieved", onSetNewLead);
  }, []);
  return (
    <>
      <PolicyInfoForm />
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
