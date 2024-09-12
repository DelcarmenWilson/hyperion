import { useCallback, useState } from "react";
import { create } from "zustand";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LeadBeneficiary } from "@prisma/client";
import {
  leadBeneficiariesGetAllById,
  leadBeneficiaryDeleteById,
  leadBeneficiaryGetById,
  leadBeneficiaryInsert,
  leadBeneficiaryUpdateById,
} from "@/actions/lead/beneficiary";
import { LeadBeneficiarySchemaType } from "@/schemas/lead";

type BeneficiaryStore = {
  beneficiaryId?: string;
  setBeneficiaryId: (b: string) => void;
  isBeneficiaryFormOpen: boolean;
  onBeneficiaryFormOpen: (b?: string) => void;
  onBeneficiaryFormClose: () => void;
};

export const useBeneficiaryStore = create<BeneficiaryStore>((set) => ({
  setBeneficiaryId: (b) => set({ beneficiaryId: b }),
  isBeneficiaryFormOpen: false,
  onBeneficiaryFormOpen: (b) =>
    set({ beneficiaryId: b, isBeneficiaryFormOpen: true }),
  onBeneficiaryFormClose: () => set({ isBeneficiaryFormOpen: false }),
}));

export const useLeadBeneficiaryActions = () => {
  const { leadId } = useLeadStore();
  const {
    beneficiaryId,
    isBeneficiaryFormOpen,
    onBeneficiaryFormOpen,
    onBeneficiaryFormClose,
  } = useBeneficiaryStore();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const { data: beneficiaries, isFetching: isFetchingBeneficiaries } = useQuery<
    LeadBeneficiary[]
  >({
    queryFn: () => leadBeneficiariesGetAllById(leadId as string),
    queryKey: [`leadBeneficiaries-${leadId}`],
  });

  const { data: beneficiary, isFetching: isFetchingBeneficiary } =
    useQuery<LeadBeneficiary | null>({
      queryFn: () => leadBeneficiaryGetById(beneficiaryId as string),
      queryKey: [`leadBeneficiary-${beneficiaryId}`],
    });

  const { mutate, isPending: isBeneficiaryPending } = useMutation({
    mutationFn: beneficiaryId
      ? leadBeneficiaryUpdateById
      : leadBeneficiaryInsert,
    onSuccess: () => {
      const toastString = beneficiaryId
        ? "Beneficiary updated successfully"
        : "Beneficiary created successfully";

      toast.success(toastString, {
        id: "insert-update-beneficiary",
      });

      queryClient.invalidateQueries({
        queryKey: ["leadBeneficiaries", `lead-${leadId}`],
      });

      onBeneficiaryFormClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onBeneficiarySubmit = useCallback(
    (values: LeadBeneficiarySchemaType) => {
      const toastString = beneficiaryId
        ? "Updating Beneficiary..."
        : "Creating Beneficiary...";
      toast.loading(toastString, { id: "insert-update-beneficiary" });

      mutate(values);
    },
    [mutate]
  );

  const { mutate: onBeneficiaryDelete, isPending: isPendingBeneficiaryDelete } =
    useMutation({
      mutationFn: leadBeneficiaryDeleteById,
      onSuccess: () => {
        toast.success("Beneficiary Deleted", {
          id: "delete-beneficiary",
        });
        queryClient.invalidateQueries({
          queryKey: [`leadBeneficiary-${beneficiaryId}`],
        });

        setAlertOpen(false);
      },
    });
  return {
    leadId,
    alertOpen,
    setAlertOpen,
    isBeneficiaryFormOpen,
    onBeneficiaryFormOpen,
    onBeneficiaryFormClose,
    beneficiaries,
    isFetchingBeneficiaries,
    beneficiary,
    isFetchingBeneficiary,
    onBeneficiarySubmit,
    isBeneficiaryPending,
    onBeneficiaryDelete,
    isPendingBeneficiaryDelete,
  };
};
