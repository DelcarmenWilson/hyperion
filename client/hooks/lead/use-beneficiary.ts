import { useCallback } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useLeadStore } from "@/stores/lead-store";
import { useBeneficiaryStore } from "@/stores/beneficiary-store";

import { LeadBeneficiary } from "@prisma/client";
import { LeadBeneficiarySchemaType } from "@/schemas/lead";

import {
  createLeadBeneficiary,
  convertLeadToBeneficiary,
  getLeadBeneficiaries,
  getLeadBeneficiary,
  deleteLeadBeneficiary,
  updateLeadBeneficiary,
} from "@/actions/lead/beneficiary";


export const useLeadBeneficiaryData = (leadId: string) => {
  const { beneficiaryId } = useBeneficiaryStore();

  const onGetLeadBeneficiaries = () => {
    const {
      data: beneficiaries,
      isFetching: beneficiariesFetching,
      isLoading: beneficiariesLoading,
    } = useQuery<LeadBeneficiary[]>({
      queryFn: () => getLeadBeneficiaries(leadId as string),
      queryKey: [`lead-beneficiaries-${leadId}`],
      enabled: !!leadId,
    });
    return {
      beneficiaries,
      beneficiariesFetching,
      beneficiariesLoading,
    };
  };

  const onGetLeadBeneficiary = () => {
    const {
      data: beneficiary,
      isFetching: beneficiaryFetching,
      isLoading: beneficiaryLoading,
    } = useQuery<LeadBeneficiary | null>({
      queryFn: () => getLeadBeneficiary(beneficiaryId as string),
      queryKey: [`lead-beneficiary-${beneficiaryId}`],
      enabled:!!beneficiaryId
    });
    return {
      beneficiary,
      beneficiaryFetching,
      beneficiaryLoading,
    };
  };

  return {
    onGetLeadBeneficiaries,
    onGetLeadBeneficiary,
  };
};
//TODO - need to add a delete dialog and remove the alert open state
export const useLeadBeneficiaryActions = () => {
  const { leadId } = useLeadStore();
  const { beneficiaryId, onBeneficiaryFormClose } = useBeneficiaryStore();
  const { invalidate } = useInvalidate();

  //TODO - this need to be split into two functions
  const { mutate: upsertBeneficiary, isPending: beneficiaryUpdserting } =
    useMutation({
      mutationFn: beneficiaryId ? updateLeadBeneficiary : createLeadBeneficiary,
      onSuccess: () => {
        const toastString = beneficiaryId
          ? "Beneficiary updated successfully"
          : "Beneficiary created successfully";

        toast.success(toastString, { id: "insert-update-beneficiary" });
        invalidate(`lead-beneficiaries-${leadId}`);
        onBeneficiaryFormClose();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onBeneficiaryUpsert = useCallback(
    (values: LeadBeneficiarySchemaType) => {
      const toastString = beneficiaryId
        ? "Updating Beneficiary..."
        : "Creating Beneficiary...";
      toast.loading(toastString, { id: "insert-update-beneficiary" });
      upsertBeneficiary(values);
    },
    [upsertBeneficiary]
  );
  //DELETE BENEFICIARY
  const { mutate: onDeleteBeneficiary, isPending: beneficiaryDeleting } =
    useMutation({
      mutationFn: deleteLeadBeneficiary,
      onSuccess: () => {
        toast.success("Beneficiary Deleted", { id: "delete-beneficiary" });
        invalidate(`lead-beneficiary-${beneficiaryId}`);
      },
    });

  //CONVERT BENEFICIARY
  const {
    mutate: convertLeadToBeneficiaryMutate,
    isPending: beneficiaryConverting,
  } = useMutation({
    mutationFn: convertLeadToBeneficiary,
    onSuccess: () => {
      toast.success("Beneficiary converted!!!", {
        id: "convert-beneficiary",
      });
      invalidate(`lead-beneficiaries-${leadId}`);
      invalidate(`lead-associated-${leadId}`);
    },
  });

  const onConvertBeneficiary = useCallback(
    (beneficiaryId: string) => {
      toast.loading("Converting beneficiary to lead...", {
        id: "convert-beneficiary",
      });
      convertLeadToBeneficiaryMutate({
        leadId: leadId as string,
        beneficiaryId,
      });
    },
    [convertLeadToBeneficiaryMutate, leadId]
  );

  return {
    onBeneficiaryUpsert,
    beneficiaryUpdserting,
    onDeleteBeneficiary,
    beneficiaryDeleting,
    onConvertBeneficiary,
    beneficiaryConverting,
  };
};
