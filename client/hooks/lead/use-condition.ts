import { useCallback, useState } from "react";
import { create } from "zustand";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MedicalCondition } from "@prisma/client";
import { FullLeadMedicalCondition } from "@/types";
import { LeadConditionSchemaType } from "@/schemas/lead";
import {
  leadConditionDeleteById,
  leadConditionGetById,
  leadConditionInsert,
  leadConditionsGetAllById,
  leadConditionUpdateById,
} from "@/actions/lead/condition";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";

type LeadConditionStore = {
  conditionId?: string;
  setConditionId: (b: string) => void;
  isConditionFormOpen: boolean;
  onConditionFormOpen: (b?: string) => void;
  onConditionFormClose: () => void;
};

export const useLeadConditionStore = create<LeadConditionStore>((set) => ({
  setConditionId: (b) => set({ conditionId: b }),
  isConditionFormOpen: false,
  onConditionFormOpen: (b) =>
    set({ conditionId: b, isConditionFormOpen: true }),
  onConditionFormClose: () => set({ isConditionFormOpen: false }),
}));

export const useLeadConditionActions = () => {
  const { leadId } = useLeadStore();
  const {
    conditionId,
    isConditionFormOpen,
    onConditionFormOpen,
    onConditionFormClose,
  } = useLeadConditionStore();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const { data: conditions, isFetching: isFetchingConditions } = useQuery<
    FullLeadMedicalCondition[]
  >({
    queryFn: () => leadConditionsGetAllById(leadId as string),
    queryKey: [`leadConditions-${leadId}`],
  });

  const { data: condition, isFetching: isFetchingCondition } =
    useQuery<FullLeadMedicalCondition | null>({
      queryFn: () => leadConditionGetById(conditionId as string),
      queryKey: [`leadCondition-${conditionId}`],
    });

  const { mutate, isPending: isConditionPending } = useMutation({
    mutationFn: conditionId ? leadConditionUpdateById : leadConditionInsert,
    onSuccess: () => {
      const toastString = conditionId
        ? "Condition updated successfully"
        : "Condition created successfully";

      toast.success(toastString, {
        id: "insert-update-condition",
      });

      queryClient.invalidateQueries({
        queryKey: ["leadConditions", `lead-${leadId}`],
      });

      onConditionFormClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onConditionSubmit = useCallback(
    (values: LeadConditionSchemaType) => {
      const toastString = conditionId
        ? "Updating Condition..."
        : "Creating Condition...";
      toast.loading(toastString, { id: "insert-update-condition" });

      mutate(values);
    },
    [mutate]
  );

  const { mutate: onConditionDelete, isPending: isPendingConditionDelete } =
    useMutation({
      mutationFn: leadConditionDeleteById,
      onSuccess: () => {
        toast.success("Condition Deleted", {
          id: "condtion-beneficiary",
        });
        queryClient.invalidateQueries({
          queryKey: [`leadCondition-${conditionId}`],
        });

        setAlertOpen(false);
      },
    });

  //TODO this does not belong here. please find it a home
  const { data: adminConditions, isFetching: isFetchingAdminConditions } =
    useQuery<MedicalCondition[]>({
      queryKey: ["adminConditions"],
      queryFn: () => adminMedicalConditionsGetAll(),
    });

  return {
    leadId,
    alertOpen,
    setAlertOpen,
    isConditionFormOpen,
    onConditionFormOpen,
    onConditionFormClose,
    conditions,
    isFetchingConditions,
    condition,
    isFetchingCondition,
    onConditionSubmit,
    isConditionPending,
    adminConditions,
    isFetchingAdminConditions,
    onConditionDelete,
    isPendingConditionDelete,
  };
};
