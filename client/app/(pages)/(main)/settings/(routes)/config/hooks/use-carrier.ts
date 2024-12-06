import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";

import { toast } from "sonner";

import { UserCarrierSchemaType } from "@/schemas/user";
import { FullUserCarrier } from "@/types";

import {
  deleteUserCarrier,
  createUserCarrier,
  getUserCarriers,
  updateUserCarrier,
} from "@/actions/user/carrier";

export const useAgentCarrierData = () => {
  const { data: carriers, isFetching: isFetchingCarriers } = useQuery<
    FullUserCarrier[]
  >({
    queryFn: () => getUserCarriers(),
    queryKey: ["agent-carriers"],
  });

  return {
    carriers,
    isFetchingCarriers,
  };
};

export const useAgentCarrierActions = (cb?: () => void) => {
  const { invalidate } = useInvalidate();

  //DELETE CARRIER
  const { mutate: deleteCarrierMutate, isPending: carrierDeleting } =
    useMutation({
      mutationFn: deleteUserCarrier,
      onSuccess: () => {
        toast.success("Carrier deleted", {
          id: "delete-agent-carrier",
        });
        invalidate("agent-carriers");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "delete-agent-carrier",
        }),
    });
  const onDeleteCarrier = useCallback(
    (id: string) => {
      toast.loading("Updating Lead Status...", { id: "delete-agent-carrier" });

      deleteCarrierMutate(id);
    },
    [deleteCarrierMutate]
  );
  //CREATE CARIIER
  const { mutate: createCarrierMutate, isPending: carrierCreating } =
    useMutation({
      mutationFn: createUserCarrier,
      onSuccess: () => {
        if (cb) cb();
        toast.success("Carrier created!", {
          id: "create-agent-carrier",
        });
        invalidate("agent-carriers");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "create-agent-carrier",
        }),
    });

  const onCreateCarrier = useCallback(
    (values: UserCarrierSchemaType) => {
      toast.loading("Creating new carrier...", { id: "create-agent-carrier" });
      createCarrierMutate(values);
    },
    [createCarrierMutate]
  );
  //UPDATE CARIIER
  const { mutate: updateCarrierMutate, isPending: carrierUpdating } =
    useMutation({
      mutationFn: updateUserCarrier,
      onSuccess: () => {
        if (cb) cb();
        toast.success("Carrier created!", {
          id: "update-agent-carrier",
        });
        invalidate("agent-carriers");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "update-agent-carrier",
        }),
    });
  const onUpdateCarrier = useCallback(
    (values: UserCarrierSchemaType) => {
      toast.loading("Updating carrier...", { id: "update-agent-carrier" });
      updateCarrierMutate(values);
    },
    [updateCarrierMutate]
  );

  return {
    onDeleteCarrier,
    carrierDeleting,
    onCreateCarrier,
    carrierCreating,
    onUpdateCarrier,
    carrierUpdating,
  };
};
