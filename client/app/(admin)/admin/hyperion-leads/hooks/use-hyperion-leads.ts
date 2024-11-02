import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useQuery } from "@tanstack/react-query";

import { HyperionLead } from "@prisma/client";

import { hyperionLeadsGetAll } from "@/actions/admin/hyperion";

export const useHyperionLeadsData = () => {
  const user = useCurrentUser();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { data: leads, isFetching: isLeadsFetching } = useQuery<
    HyperionLead[] | []
  >({
    queryFn: () => hyperionLeadsGetAll(),
    queryKey: ["hyperionLeads"],
  });

  return { isList, setIsList, leads, isLeadsFetching };
};
