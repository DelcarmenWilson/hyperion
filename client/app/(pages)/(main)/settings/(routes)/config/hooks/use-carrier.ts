import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FullUserCarrier } from "@/types";
import {
  userCarrierDeleteById,
  userCarriersGetAll,
} from "@/actions/user/carrier";

export const useAgentCarrierData = () => {
  const { data: carriers, isFetching: isFetchingCarriers } = useQuery<
    FullUserCarrier[]
  >({
    queryFn: () => userCarriersGetAll(),
    queryKey: ["agent-carriers"],
  });

  return {
    carriers,
    isFetchingCarriers,
  };
};

export const useAgentCarrierActions = () => {
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["agent-carriers`"] });
  };

  const { mutate: carrierDelete, isPending: isPendingCarrierDelete } =
    useMutation({
      mutationFn: userCarrierDeleteById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Carrier deleted", {
            id: "delete-agent-carrier",
          });
          invalidate();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const onCarrierDelete = useCallback(
    (id: string) => {
      toast.loading("Updating Lead Status...", { id: "delete-agent-carrier" });

      carrierDelete(id);
    },
    [carrierDelete]
  );

  return { alertOpen, setAlertOpen, onCarrierDelete, isPendingCarrierDelete };
};
