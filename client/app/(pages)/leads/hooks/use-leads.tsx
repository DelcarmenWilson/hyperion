import { useEffect, useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { leadsGetAll } from "@/actions/lead";
import { FullLead } from "@/types";

export const useLeadsData = () => {
  const queryClient = useQueryClient();
  const [leads, setLeads] = useState<FullLead[]>();

  // const invalidate = (queries: string[]) => {
  //   queries.forEach((query) => {
  //     queryClient.invalidateQueries({ queryKey: [query] });
  //   });
  // };

  const { data: initLeads, isFetching: isFetchingLeads } = useQuery<
    FullLead[] | []
  >({
    queryFn: () => leadsGetAll(),
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
    isFetchingLeads,
  };
};
