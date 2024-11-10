import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LeadStatus } from "@prisma/client";
import { leadStatusGetAllDefault } from "@/actions/lead/status";
import { userLeadStatusDeleteById } from "@/actions/user/lead-status";

export const useAgentLeadStatusData = () => {
  const { data: leadStatuses, isFetching: isFetchingLeadStatuses } = useQuery<
  LeadStatus[]
  >({
    queryFn: () => leadStatusGetAllDefault(),
    queryKey: ["agent-leadstatus"],
  });

  return {
    leadStatuses,
    isFetchingLeadStatuses,
  };
};

export const useAgentLeadStatusActions = () => {
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["agent-leadstatuss`"] });
  };

  const { mutate: leadStatusDelete, isPending: isPendingLeadStatusDelete } =
    useMutation({
      mutationFn: userLeadStatusDeleteById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Lead Status deleted", {
            id: "delete-agent-leadstatus",
          });
          invalidate();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const onLeadStatusDelete = useCallback(
    (id: string) => {
      toast.loading("Deleteing Lead Status...", { id: "delete-agent-leadstatus" });

      leadStatusDelete(id);
    },
    [leadStatusDelete]
  );

  return { alertOpen, setAlertOpen, onLeadStatusDelete, isPendingLeadStatusDelete };
};
