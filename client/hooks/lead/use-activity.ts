import { useEffect, useState } from "react";
import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";

import { LeadActivity } from "@prisma/client";
import { leadActivitiesGet } from "@/actions/lead/activity";

export const useLeadActivityData = () => {
    const { leadId } = useLeadId();
    
    const { data: initActivities, isFetching: isFetchingActivities } = useQuery<
    LeadActivity[]
    >({
      queryFn: () => leadActivitiesGet(leadId),
      queryKey: [`leadActivities-${leadId}`],
    });

    
  const [activities, setActivities] = useState(initActivities);

  const onSetActivities = (type: string) => {
    setActivities(
      initActivities?.filter((e) => e.type.toLocaleLowerCase().includes(type == "%" ? "" : type.toLocaleLowerCase()))
    );
  };

  useEffect(() => {
    if (!initActivities) return;
    setActivities(initActivities);
  }, [initActivities]);

    return {
        activities,isFetchingActivities,onSetActivities
    }

}