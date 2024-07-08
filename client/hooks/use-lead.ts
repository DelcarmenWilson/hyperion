import { useContext } from "react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import { LeadBeneficiary, User } from "@prisma/client";

import {
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
} from "@/actions/lead/intake";
import { leadBeneficiariesGetAllById } from "@/actions/lead/beneficiary";
type DialogType="personal" | "doctor" | "bank" | "other" | "policy" | "medical"
type useLeadStore = {
  leadId?: string;
  leadFullName?: string;
  sharedUser?: User | null;
  // SHARE
  isShareFormOpen: boolean;
  onShareFormOpen: (l: string, n: string, u: User) => void;
  onShareFormClose: () => void;
  //TRANSFER
  isTransferFormOpen: boolean;
  onTransferFormOpen: (l: string, n: string) => void;
  onTransferFormClose: () => void;
  //INTAKE FORM
  isIntakeFormOpen: boolean;
  onIntakeFormOpen: (l: string, n: string) => void;
  onIntakeFormClose: () => void;
  dialogType:DialogType
  isIntakeDialogOpen: boolean;
  onIntakeDialogOpen: (d:DialogType) => void;
  onIntakeDialogClose: () => void;
};

export const useLead = create<useLeadStore>((set) => ({
  //SHARE
  isShareFormOpen: false,
  onShareFormOpen: (l, n, u) =>
    set({ leadId: l, leadFullName: n, sharedUser: u, isShareFormOpen: true }),
  onShareFormClose: () =>
    set({
      leadId: "",
      leadFullName: "",
      sharedUser: null,
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
  //INTAKE
  isIntakeFormOpen: false,
  onIntakeFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isIntakeFormOpen: true }),
  onIntakeFormClose: () =>
    set({
      leadId: "",
      isIntakeFormOpen: false,
    }),

    dialogType:"personal",
    isIntakeDialogOpen: false,
    onIntakeDialogOpen: (d:DialogType) => set({
      dialogType:d,
      isIntakeDialogOpen: true,
    }),
    onIntakeDialogClose: () => set({
      isIntakeDialogOpen: false,
    }),
}));

export const useLeadActions = () => {
  const user = useCurrentUser();
  const { socket } = useContext(SocketContext).SocketState;

  //SHARING
  const onLeadUpdateByIdShare = async (
    leadId?: string,
    sharedUserId?: string
  ) => {
    if (!leadId || !sharedUserId) return;
    const updatedShare = await leadUpdateByIdShare(leadId, sharedUserId);

    if (updatedShare.success) {
      toast.success(updatedShare.message);
      socket?.emit(
        "lead-shared",
        sharedUserId,
        user?.name,
        leadId,
        updatedShare.success
      );
      return true;
    } else toast.error(updatedShare.error);
    return false;
  };

  const onLeadUpdateByIdUnShare = async (
    leadId?: string,
    sharedUserId?: string
  ) => {
    if (!leadId) return;
    const updatedShare = await leadUpdateByIdUnShare(leadId);

    if (updatedShare.success) {
      toast.success(updatedShare.message);
      socket?.emit(
        "lead-unshared",
        sharedUserId,
        user?.name,
        leadId,
        updatedShare.success
      );
      return true;
    } else toast.error(updatedShare.error);
    return false;
  };
  //TRANSFER
  const onLeadUpdateByIdTransfer = async (
    leadId?: string,
    selectedUserId?: string
  ) => {
    if (!leadId || !selectedUserId) return;
    const transferedLead = await leadUpdateByIdTransfer(leadId, selectedUserId);

    if (transferedLead.success) {
      toast.success(transferedLead.success);
      socket?.emit(
        "lead-transfered",
        selectedUserId,
        user?.name,
        leadId,
        transferedLead.success
      );
      userEmitter.emit("leadTransfered", leadId);

      return true;
    } else toast.error(transferedLead.error);
    return false;
  };

  return {
    onLeadUpdateByIdShare,
    onLeadUpdateByIdUnShare,
    onLeadUpdateByIdTransfer,
  };
};

export const useLeadIntakeActions = () => {
  // const user = useCurrentUser();
  // const { socket } = useContext(SocketContext).SocketState;

  const getIntakeData = (leadId: string) => {
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

  // //SHARING
  // const onLeadUpdateByIdShare = async (
  //   leadId?: string,
  //   sharedUserId?: string
  // ) => {
  //   if (!leadId || !sharedUserId) return;
  //   const updatedShare = await leadUpdateByIdShare(leadId, sharedUserId);

  //   if (updatedShare.success) {
  //     toast.success(updatedShare.message);
  //     socket?.emit(
  //       "lead-shared",
  //       sharedUserId,
  //       user?.name,
  //       leadId,
  //       updatedShare.success
  //     );
  //     return true;
  //   } else toast.error(updatedShare.error);
  //   return false;
  // };

  // const onLeadUpdateByIdUnShare = async (
  //   leadId?: string,
  //   sharedUserId?: string
  // ) => {
  //   if (!leadId) return;
  //   const updatedShare = await leadUpdateByIdUnShare(leadId);

  //   if (updatedShare.success) {
  //     toast.success(updatedShare.message);
  //     socket?.emit(
  //       "lead-unshared",
  //       sharedUserId,
  //       user?.name,
  //       leadId,
  //       updatedShare.success
  //     );
  //     return true;
  //   } else toast.error(updatedShare.error);
  //   return false;
  // };
  // //TRANSFER
  // const onLeadUpdateByIdTransfer = async (
  //   leadId?: string,
  //   selectedUserId?: string
  // ) => {
  //   if (!leadId||!selectedUserId) return;
  //   const transferedLead = await leadUpdateByIdTransfer(leadId,selectedUserId);

  //   if (transferedLead.success) {

  //     toast.success(transferedLead.success);
  //     socket?.emit(
  //       "lead-transfered",
  //       selectedUserId,
  //       user?.name,
  //       leadId,
  //       transferedLead.success
  //     );
  //     userEmitter.emit("leadTransfered", leadId);

  //     return true;
  //   } else toast.error(transferedLead.error);
  //   return false;
  // };

  return {getIntakeData};
};
