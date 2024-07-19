import { useCallback, useContext, useState } from "react";
import SocketContext from "@/providers/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import { LeadBeneficiary, User } from "@prisma/client";

import {
  leadUpdateByIdAssistantAdd,
  leadUpdateByIdAssistantRemove,
  leadUpdateByIdPolicyInfo,
  leadUpdateByIdShare,
  leadUpdateByIdTransfer,
  leadUpdateByIdUnShare,
} from "@/actions/lead";
import { useCurrentUser } from "./use-current-user";
import { useQuery } from "@tanstack/react-query";
import {
  IntakeBankInfoSchemaType,
  IntakeDoctorInfoSchemaType,
  IntakeMedicalInfoSchemaType,
  IntakeOtherInfoSchemaType,
  IntakePersonalInfoSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";
import {
  leadGetByIdIntakeBankInfo,
  leadGetByIdIntakeDoctorInfo,
  leadGetByIdIntakeMedicalInfo,
  leadGetByIdIntakeOtherInfo,
  leadGetByIdIntakePersonalInfo,
  leadGetByIdIntakePolicyInfo,
  leadInsertIntakeBankInfo,
  leadInsertIntakeDoctorInfo,
  leadUpdateByIdIntakeBankInfo,
  leadUpdateByIdIntakeDoctorInfo,
  leadUpdateByIdIntakeMedicalInfo,
  leadUpdateByIdIntakeOtherInfo,
} from "@/actions/lead/intake";
import { leadBeneficiariesGetAllById } from "@/actions/lead/beneficiary";
import { leadUpdateByIdIntakePersonalInfo } from "@/actions/lead/intake";
type DialogType =
  | "personal"
  | "doctor"
  | "bank"
  | "other"
  | "policy"
  | "medical";
type useLeadStore = {
  leadId?: string;
  leadFullName?: string;
  //POLICY
  policyInfo?: LeadPolicySchemaType;
  isPolicyFormOpen: boolean;
  onPolicyFormOpen: (l: string,n:string,p?: LeadPolicySchemaType) => void;
  onPolicyFormClose: () => void;
  // SHARE
  initUser?: User | null;
  isShareFormOpen: boolean;
  onShareFormOpen: (l: string, n: string, u: User) => void;
  onShareFormClose: () => void;
  //TRANSFER
  isTransferFormOpen: boolean;
  onTransferFormOpen: (l: string, n: string) => void;
  onTransferFormClose: () => void;
  //ASSISTANT
  isAssistantFormOpen: boolean;
  onAssistantFormOpen: (l: string,n:string, u?: User) => void;
  onAssistantFormClose: () => void;
  //INTAKE FORM
  isIntakeFormOpen: boolean;
  onIntakeFormOpen: (l: string, n: string) => void;
  onIntakeFormClose: () => void;
  dialogType: DialogType;
  isIntakeDialogOpen: boolean;
  onIntakeDialogOpen: (d: DialogType) => void;
  onIntakeDialogClose: () => void;
};

export const useLead = create<useLeadStore>((set) => ({
  isPolicyFormOpen: false,
  onPolicyFormOpen: (l, n,p) =>
    set({ leadId: l, leadFullName: n,policyInfo:p, isPolicyFormOpen: true }),
  onPolicyFormClose: () =>
    set({
      leadId: "",
      isPolicyFormOpen: false,
      isIntakeFormOpen:true
    }),
  //SHARE
  isShareFormOpen: false,
  onShareFormOpen: (l, n, u) =>
    set({ leadId: l, leadFullName: n, initUser: u, isShareFormOpen: true }),
  onShareFormClose: () =>
    set({
      leadId: "",
      leadFullName: "",
      initUser: null,
      isShareFormOpen: false,
    }),
  //TRANSFER
  isTransferFormOpen: false,
  onTransferFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isTransferFormOpen: true }),
  onTransferFormClose: () =>
    set({
      leadId: "",
      isTransferFormOpen: false,
    }),

    //ASSISTANT
    isAssistantFormOpen: false,
     onAssistantFormOpen: (l, n,u?) =>
    set({ leadId: l, leadFullName: n,initUser: u, isAssistantFormOpen: true }),
     onAssistantFormClose: () =>
    set({
      leadId: "",
      isAssistantFormOpen: false,
    }),
  //INTAKE
  isIntakeFormOpen: false,
  onIntakeFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isIntakeFormOpen: true }),
  onIntakeFormClose: () =>
    set({
      leadId: "",
      isIntakeFormOpen: false,
    }),

  dialogType: "personal",
  isIntakeDialogOpen: false,
  onIntakeDialogOpen: (d: DialogType) =>
    set({
      dialogType: d,
      isIntakeDialogOpen: true,
    }),
  onIntakeDialogClose: () =>
    set({
      isIntakeDialogOpen: false,
    }),
}));

export const useLeadActions = (
  onClose: () => void,
  leadId?: string,
  uId?: string
) => {
  const user = useCurrentUser();
  const { socket } = useContext(SocketContext).SocketState;
  const [userId, setUserId] = useState(uId);
  const [loading, setLoading] = useState(false);
  //SHARING
  const onLeadUpdateByIdShare = async () => {
    if (!leadId || !userId) return;
    setLoading(true);
    const updatedShare = await leadUpdateByIdShare(leadId, userId);

    if (updatedShare.success) {
      socket?.emit(
        "lead-shared",
        userId,
        user?.name,
        leadId,
        updatedShare.success
      );
      toast.success(updatedShare.message);
      onClose();
    } else toast.error(updatedShare.error);

    setLoading(false);
  };

  const onLeadUpdateByIdUnShare = async () => {
    if (!leadId) return;

    setLoading(true);
    const updatedShare = await leadUpdateByIdUnShare(leadId);

    if (updatedShare.success) {
      socket?.emit(
        "lead-unshared",
        userId,
        user?.name,
        leadId,
        updatedShare.success
      );
      setUserId(undefined);
      toast.success(updatedShare.message);
      onClose();
    } else toast.error(updatedShare.error);

    setLoading(false);
  };
  //TRANSFER
  const onLeadUpdateByIdTransfer = async () => {
    if (!leadId || !userId) return;

    setLoading(true);
    const transferedLead = await leadUpdateByIdTransfer(leadId, userId);
    if (transferedLead.success) {
      socket?.emit(
        "lead-transfered",
        userId,
        user?.name,
        leadId,
        transferedLead.success
      );
      userEmitter.emit("leadTransfered", leadId);

      toast.success(transferedLead.message);
      onClose();
    } else toast.error(transferedLead.error);
    setLoading(false);
  };

  //ASSISTANT
  const onLeadUpdateByIdAssistantAdd = async () => {
    if (!leadId || !userId) return;
    setLoading(true);
    const updatedAssistant = await leadUpdateByIdAssistantAdd(leadId, userId);
    if (updatedAssistant.success) {
      socket?.emit(
        "lead-assistant-added",
        userId,
        user?.name,
        leadId,
        updatedAssistant.success
      );
      toast.success(updatedAssistant.message);
      onClose();
    } else toast.error(updatedAssistant.error);

    setLoading(false);
  };

  const onLeadUpdateByIdAssistantRemove = async () => {
    if (!leadId) return;
    setLoading(true);
    const updatedAssistant = await leadUpdateByIdAssistantRemove(leadId);
    if (updatedAssistant.success) {
      toast.success(updatedAssistant.message);
      onClose();
    } else toast.error(updatedAssistant.error);

    setLoading(false);
  };

  return {
    userId,
    setUserId,
    loading,
    onLeadUpdateByIdShare,
    onLeadUpdateByIdUnShare,
    onLeadUpdateByIdTransfer,
    onLeadUpdateByIdAssistantAdd,
    onLeadUpdateByIdAssistantRemove,
  };
};

export const useLeadIntakeActions = (
  leadId: string,
  onClose?: () => void,
  info?: boolean
) => {
  // const user = useCurrentUser();
  // const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();
  //GET INTAKE DATA
  const getIntakeData = () => {
    const { data: personal, isFetching: personalIsFectching } =
      useQuery<IntakePersonalInfoSchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakePersonalInfo"],
        queryFn: () => leadGetByIdIntakePersonalInfo(leadId),
      });

    const { data: beneficiaries, isFetching: beneficiariesIsFectching } =
      useQuery<LeadBeneficiary[]>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakeBeneficiariesInfo"],
        queryFn: () => leadBeneficiariesGetAllById(leadId),
      });

    const { data: doctor, isFetching: doctorIsFectching } =
      useQuery<IntakeDoctorInfoSchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakeDoctorInfo"],
        queryFn: () => leadGetByIdIntakeDoctorInfo(leadId),
      });

    const { data: bank, isFetching: bankIsFectching } =
      useQuery<IntakeBankInfoSchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakeBankInfo"],
        queryFn: () => leadGetByIdIntakeBankInfo(leadId!),
      });

    const { data: other, isFetching: otherIsFectching } =
      useQuery<IntakeOtherInfoSchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakeOtherInfo"],
        queryFn: () => leadGetByIdIntakeOtherInfo(leadId),
      });

    const { data: policy, isFetching: policyIsFectching } =
      useQuery<LeadPolicySchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakePolicy"],
        queryFn: () => leadGetByIdIntakePolicyInfo(leadId),
      });

    const { data: medical, isFetching: medicalIsFectching } =
      useQuery<IntakeMedicalInfoSchemaType | null>({
        queryKey: ["leadInfo", `lead-${leadId}`, "leadIntakeMedicalInfo"],
        queryFn: () => leadGetByIdIntakeMedicalInfo(leadId),
      });

    return {
      personal,
      personalIsFectching,
      beneficiaries,
      beneficiariesIsFectching,
      doctor,
      doctorIsFectching,
      bank,
      bankIsFectching,
      other,
      otherIsFectching,
      policy,
      policyIsFectching,
      medical,
      medicalIsFectching,
    };
  };
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({
      queryKey: ["leadInfo", `lead-${leadId}`, key],
    });
  };
  //PERSONAL INFO
  const { mutate: personalMutate, isPending: personalIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakePersonalInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "update-personal-info",
      });

      invalidate("leadIntakePersonalInfo");

      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onPersonalSubmit = useCallback(
    (values: IntakePersonalInfoSchemaType) => {
      const toastString = "Updating Personal Information...";
      toast.loading(toastString, { id: "update-personal-info" });

      personalMutate(values);
    },
    [personalMutate]
  );
  //DOCTOR
  const { mutate: doctorMutate, isPending: doctorIsPending } = useMutation({
    mutationFn: info
      ? leadUpdateByIdIntakeDoctorInfo
      : leadInsertIntakeDoctorInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "insert-update-doctor-info",
      });
      invalidate("leadIntakeDoctorInfo");

      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDoctorSubmit = useCallback(
    (values: IntakeDoctorInfoSchemaType) => {
      const toastString = info
        ? "Updating Doctor Information..."
        : "Creating Doctor Information...";
      toast.loading(toastString, { id: "insert-update-doctor-info" });

      doctorMutate(values);
    },
    [doctorMutate, info]
  );
  //BANK
  const { mutate: bankMutate, isPending: bankIsPending } = useMutation({
    mutationFn: info ? leadUpdateByIdIntakeBankInfo : leadInsertIntakeBankInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "insert-update-bank-info",
      });

      invalidate("leadIntakeBankInfo");

      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onBankSubmit = useCallback(
    (values: IntakeBankInfoSchemaType) => {
      const toastString = info
        ? "Updating Bank Information..."
        : "Creating Bank Information...";
      toast.loading(toastString, { id: "insert-update-bank-info" });

      bankMutate(values);
    },
    [bankMutate, info]
  );
  //OTHER
  const { mutate: otherMutate, isPending: otherIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeOtherInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "update-other-info",
      });
      invalidate("leadIntakeOtherInfo");

      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onOtherSubmit = useCallback(
    (values: IntakeOtherInfoSchemaType) => {
      const toastString = "Updating Other Information...";
      toast.loading(toastString, { id: "update-other-info" });

      otherMutate(values);
    },
    [otherMutate]
  );
  //POLICY
  const { mutate: policyMutate, isPending: policyIsPending } = useMutation({
    mutationFn: leadUpdateByIdPolicyInfo,
    onSuccess: (result) => {
      if (result.success) {
        userEmitter.emit("policyInfoUpdated", {
          ...result.success,
          startDate: result.success?.startDate || undefined,
        });
        userEmitter.emit("leadStatusChanged", result.success.leadId, "Sold");

        toast.success("Lead Policy Info Updated", {
          id: "update-policy-info",
        });

        invalidate("leadIntakePolicy");

        if (onClose) onClose();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPolicySubmit = useCallback(
    (values: LeadPolicySchemaType) => {
      console.log(values)
      const toastString = "Updating Policy Information...";
      toast.loading(toastString, { id: "update-policy-info" });

      policyMutate(values);
    },
    [policyMutate]
  );

  const { mutate: medicalMutate, isPending: medicalIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeMedicalInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "update-medical-info",
      });

      invalidate("leadIntakeMedicalInfo");

      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onMedicalSubmit = useCallback(
    (values: IntakeMedicalInfoSchemaType) => {
      const toastString = "Updating Medical Information...";
      toast.loading(toastString, { id: "update-medical-info" });

      medicalMutate(values);
    },
    [medicalMutate]
  );

  return {
    getIntakeData,
    personalIsPending,
    onPersonalSubmit,
    doctorIsPending,
    onDoctorSubmit,
    bankIsPending,
    onBankSubmit,
    otherIsPending,
    onOtherSubmit,
    policyIsPending,
    onPolicySubmit,
    medicalIsPending,
    onMedicalSubmit,
  };
};
