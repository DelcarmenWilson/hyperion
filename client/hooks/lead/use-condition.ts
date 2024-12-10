import { useCallback } from "react";
import { toast } from "sonner";
import { useLeadStore } from "@/stores/lead-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useLeadConditionStore } from "@/stores/lead-condition-store";

import { MedicalCondition } from "@prisma/client";
import { FullLeadMedicalCondition } from "@/types";
import { LeadConditionSchemaType } from "@/schemas/lead";
import {
  deleteLeadCondition,
  getLeadCondition,
  createLeadCondition,
  getLeadConditions,
  updateLeadCondition,
} from "@/actions/lead/condition";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";

export const useLeadConditionData = (leadId: string) => {
  const { conditionId } = useLeadConditionStore();

  //  CONDITIONS
  const onGetLeadConditions = () => {
    const {
      data: conditions,
      isFetching: conditionsFetching,
      isLoading: conditionsLoading,
    } = useQuery<FullLeadMedicalCondition[]>({
      queryFn: () => getLeadConditions(leadId),
      queryKey: [`lead-conditions-${leadId}`],
      enabled: !!leadId,
    });
    return {
      conditions,
      conditionsFetching,
      conditionsLoading,
    };
  };
  // CONDITION
  const onGetLeadCondition = () => {
    const {
      data: condition,
      isFetching: conditionFetching,
      isLoading: conditionLoading,
    } = useQuery<FullLeadMedicalCondition | null>({
      queryFn: () => getLeadCondition(conditionId as string),
      queryKey: [`lead-condition-${conditionId}`],
      enabled: !!conditionId,
    });
    return {
      condition,
      conditionFetching,
      conditionLoading,
    };
  };
  //TODO this does not belong here. please find it a home
  const onGetAdminConditions = () => {
    const {
      data: conditions,
      isFetching: conditionsFetching,
      isLoading: conditionsLoading,
    } = useQuery<MedicalCondition[]>({
      queryFn: () => adminMedicalConditionsGetAll(),
      queryKey: ["admin-conditions"],
    });
    return {
      conditions,
      conditionsFetching,
      conditionsLoading,
    };
  };

  return {
    onGetLeadConditions,
    onGetLeadCondition,
    onGetAdminConditions,
  };
};

export const useLeadConditionActions = () => {
  const { leadId } = useLeadStore();
  const { conditionId, onConditionFormClose } = useLeadConditionStore();
  const { invalidate } = useInvalidate();

  const { mutate, isPending: conditionUpserting } = useMutation({
    mutationFn: conditionId ? updateLeadCondition : createLeadCondition,
    onSuccess: () => {
      const toastString = conditionId
        ? "Condition updated successfully"
        : "Condition created successfully";

      toast.success(toastString, {
        id: "insert-update-condition",
      });

      [`lead-conditions-${leadId}`, `lead-${leadId}`].forEach((key) => invalidate(key));

      onConditionFormClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onConditionUpsert = useCallback(
    (values: LeadConditionSchemaType) => {
      const toastString = conditionId
        ? "Updating Condition..."
        : "Creating Condition...";
      toast.loading(toastString, { id: "insert-update-condition" });

      mutate(values);
    },
    [mutate]
  );

  const { mutate: onDeleteCondition, isPending: conditionDeleting } =
    useMutation({
      mutationFn: deleteLeadCondition,
      onSuccess: () => {
        toast.success("Condition Deleted", {
          id: "condtion-beneficiary",
        });
        invalidate(`leadCondition-${conditionId}`);
      },
    });

  return {
    onConditionUpsert,
    conditionUpserting,
    onDeleteCondition,
    conditionDeleting,
  };
};
