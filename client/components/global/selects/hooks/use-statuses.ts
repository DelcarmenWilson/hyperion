import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LeadStatus } from "@prisma/client";
import {
  leadStatusGetAllDefault,
  leadUpdateByIdStatus,
} from "@/actions/lead/status";
import { useCallback } from "react";
import { toast } from "sonner";

export const useLeadStatuses = () => {
  const { data: statuses, isFetching: isFetchingStatuses } = useQuery<
    LeadStatus[]
  >({
    queryFn: () => leadStatusGetAllDefault(),
    queryKey: [`userLeadStatuses`],
  });

  return {
    statuses,
    isFetchingStatuses,
  };
};

export const useLeadStatusActions = () => {
  const queryClient = useQueryClient();

  const invalidate = (key:string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };

  //LEAD STATUS
  //TODO this need to be moved closer to the lead hooks
  const { mutate: leadStatusUpdate, isPending: isPendingLeadStatusUpdate } =
    useMutation({
      mutationFn: leadUpdateByIdStatus,
      onSuccess: (results) => {
        if (results.success) 
          {
            invalidate(`lead-call-info-${results.success.id}`)
          toast.success("Lead Status Updated!", {id: "update-lead-status"});}
        else
        toast.error(results.error, {id: "update-lead-status"});
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  //TODO this need to be moved closer to the lead hooks
  const onLeadStatusUpdate = useCallback(
    (leadId: string, statusId: string) => {
      const toastString = "Updating Lead Status...";
      toast.loading(toastString, { id: "update-lead-status" });
      leadStatusUpdate({ leadId, statusId });
    },
    [leadStatusUpdate]
  );

  return {
    onLeadStatusUpdate,
    isPendingLeadStatusUpdate,
  };
};
