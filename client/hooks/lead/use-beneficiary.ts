import { useCallback, useState } from "react";
import { create } from "zustand";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LeadBeneficiary } from "@prisma/client";
import {
  getLeadBeneficiaries,
  convertLeadToBeneficiary,
  deleteLeadBeneficiary,
  getLeadBeneficiary,
  createLeadBeneficiary,
  updateLeadBeneficiary,
} from "@/actions/lead/beneficiary";
import { LeadBeneficiarySchemaType } from "@/schemas/lead";

type State = {
  beneficiaryId?: string;
  isBeneficiaryFormOpen: boolean;
};

type Actions = {
  setBeneficiaryId: (b: string) => void;
  onBeneficiaryFormOpen: (b?: string) => void;
  onBeneficiaryFormClose: () => void;
};

export const useBeneficiaryStore = create<State&Actions>((set) => ({
  setBeneficiaryId: (b) => set({ beneficiaryId: b }),
  isBeneficiaryFormOpen: false,
  onBeneficiaryFormOpen: (b) =>
    set({ beneficiaryId: b, isBeneficiaryFormOpen: true }),
  onBeneficiaryFormClose: () => set({ isBeneficiaryFormOpen: false }),
}));

export const useLeadBeneficiaryData = () => {
  const { leadId } = useLeadStore();
  const {
    beneficiaryId,
  } = useBeneficiaryStore();

  const { data: beneficiaries, isFetching: isFetchingBeneficiaries } = useQuery<
    LeadBeneficiary[]
  >({
    queryFn: () => getLeadBeneficiaries(leadId as string),
    queryKey: [`lead-beneficiaries-${leadId}`],
  });

  const { data: beneficiary, isFetching: isFetchingBeneficiary } =
    useQuery<LeadBeneficiary | null>({
      queryFn: () => getLeadBeneficiary(beneficiaryId as string),
      queryKey: [`lead-beneficiary-${beneficiaryId}`],
    });

  return {
    leadId,
    beneficiaries,
    isFetchingBeneficiaries,
    beneficiary,
    isFetchingBeneficiary,
  };
};

export const useLeadBeneficiaryActions = () => {
  const { leadId } = useLeadStore();
  const {
    beneficiaryId,
    onBeneficiaryFormClose,
  } = useBeneficiaryStore();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);
  
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({
      queryKey: [key],
    });
  };

  const { mutate, isPending: isBeneficiaryPending } = useMutation({
    mutationFn: beneficiaryId
      ? updateLeadBeneficiary
      : createLeadBeneficiary,
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
      mutationFn: deleteLeadBeneficiary,
      onSuccess: () => {
        toast.success("Beneficiary Deleted", { id: "delete-beneficiary" });
        invalidate(`lead-beneficiary-${beneficiaryId}`);

        setAlertOpen(false);
      },
    });

  const {
    mutate: beneficiaryConvertMutate,
    isPending: isPendingBeneficiaryConvert,
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

  const onBeneficiaryConvert = useCallback(
    (beneficiaryId: string) => {
      toast.loading("Converting beneficiary to lead...", {
        id: "convert-beneficiary",
      });
      beneficiaryConvertMutate({ leadId: leadId as string, beneficiaryId });
    },
    [beneficiaryConvertMutate,leadId]
  );

  return {
    alertOpen,
    setAlertOpen,
    onBeneficiarySubmit,
    isBeneficiaryPending,
    onBeneficiaryDelete,
    isPendingBeneficiaryDelete,
    onBeneficiaryConvert,
    isPendingBeneficiaryConvert,
  };
};

