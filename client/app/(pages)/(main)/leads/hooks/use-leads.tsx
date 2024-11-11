import { useEffect, useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { FullLead } from "@/types";
import { getLeads } from "@/actions/lead/main/get-leads";

export const useLeadsData = () => {
  const [leads, setLeads] = useState<FullLead[]>();

  const { data: initLeads, isFetching: isFetchingLeads } = useQuery<
    FullLead[] | []
  >({
    queryFn: () => getLeads(),
    queryKey: ["leads"],
  });

  useEffect(() => {
    const onSetLeads = (leadIds: string[]) => {
      setLeads((lds) => lds && lds.filter((e) => !leadIds.includes(e.id)));
    };

    const onSetNewLead = async (leadIds: string[]) => {
      const response = await axios.post("/api/leads/details/by-id", {
        leadId: leadIds[0],
      });
      const lead = response.data;
      setLeads((lds) => [lead, ...lds!]);
    };

    userEmitter.on("leadTransfered", onSetLeads);
    userEmitter.on("leadTransferedRecieved", onSetNewLead);
  }, []);

  useEffect(() => {
    if (!initLeads) return;
    setLeads(initLeads);
  }, [initLeads]);
  return {
    leads,
    initLeads,
    isFetchingLeads,
  };
};
