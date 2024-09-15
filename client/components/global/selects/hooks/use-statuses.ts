import { useMutation, useQuery } from "@tanstack/react-query";
import { LeadStatus } from "@prisma/client";
import { leadStatusGetAllDefault, leadUpdateByIdStatus } from "@/actions/lead/status";
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
  // const queryClient = useQueryClient();

  // const invalidate = () => {
  //   queryClient.invalidateQueries({ queryKey: [`leadPolicy-${leadId}`] });
  // };

  

  //LEAD STATUS
  //TODO this need to be moved closer to the lead hooks
  const { mutate: leadStatusUpdate, isPending: isPendingLeadStatusUpdate } = useMutation({
    mutationFn: leadUpdateByIdStatus,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Lead Status Updated", {
          id: "update-lead-status",
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
//TODO this need to be moved closer to the lead hooks
  const onLeadStatusUpdate = useCallback(
    (leadId:string, status: string) => {
      const toastString = "Updating Lead Status...";
      toast.loading(toastString, { id: "update-lead-status" });

      leadStatusUpdate({leadId,status});
    },
    [leadStatusUpdate]
  );

  return {
    onLeadStatusUpdate,
    isPendingLeadStatusUpdate,
  };
};

