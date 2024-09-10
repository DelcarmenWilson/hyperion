import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SocketContext from "@/providers/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import { Activity, Appointment, LeadBeneficiary, User } from "@prisma/client";
import { FullCall, FullLead, LeadPrevNext } from "@/types";

import {
  leadGetByIdGeneral,
  leadGetByIdMain,
  leadUpdateByIdAssistantAdd,
  leadUpdateByIdAssistantRemove,
  leadUpdateByIdDefaultNumber,
  leadUpdateByIdGeneralInfo,
  leadUpdateByIdMainInfo,
  leadUpdateByIdPolicyInfo,
  leadUpdateByIdQuote,
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
  LeadGeneralSchemaType,
  LeadGeneralSchemaTypeP,
  LeadMainSchemaType,
  LeadMainSchemaTypeP,
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
import { useRouter } from "next/navigation";
import { smsCreateInitial } from "@/actions/sms";

import { leadGetById, leadGetPrevNextById } from "@/actions/lead";
import { callsGetAllByLeadId } from "@/actions/call";
import { leadActivitiesGet } from "@/actions/lead/activity";
import { leadAppointmentsGet } from "@/actions/lead/appointment";

type DialogType =
  | "personal"
  | "doctor"
  | "bank"
  | "other"
  | "policy"
  | "medical";
type useLeadStore = {
  onTableClose?: () => void;
  leadId?: string;
  leadIds?: string[];
  leadFullName?: string;
  //MAIN INFO
  isMainFormOpen: boolean;
  onMainFormOpen: (l: string) => void;
  onMainFormClose: () => void;
  //GENERAL INFO
  isGeneralFormOpen: boolean;
  onGeneralFormOpen: (l: string) => void;
  onGeneralFormClose: () => void;
  //POLICY
  policyInfo?: LeadPolicySchemaType;
  isPolicyFormOpen: boolean;
  onPolicyFormOpen: (l: string, n: string, p?: LeadPolicySchemaType) => void;
  onPolicyFormClose: () => void;
  // SHARE
  initUser?: User | null;
  isShareFormOpen: boolean;
  onShareFormOpen: (l: string[], n: string, u?: User, f?: () => void) => void;
  onShareFormClose: () => void;
  //TRANSFER
  isTransferFormOpen: boolean;
  onTransferFormOpen: (l: string[], n: string, f?: () => void) => void;
  onTransferFormClose: () => void;
  //ASSISTANT
  isAssistantFormOpen: boolean;
  //TODO - this should be multiple leads
  onAssistantFormOpen: (l: string, n: string, u?: User) => void;
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
  isMainFormOpen: false,
  onMainFormOpen: (l) => set({ leadId: l, isMainFormOpen: true }),
  onMainFormClose: () => set({ isMainFormOpen: false }),
  isGeneralFormOpen: false,
  onGeneralFormOpen: (l) => set({ leadId: l, isGeneralFormOpen: true }),
  onGeneralFormClose: () => set({ isGeneralFormOpen: false }),
  isPolicyFormOpen: false,
  onPolicyFormOpen: (l, n, p) =>
    set({ leadId: l, leadFullName: n, policyInfo: p, isPolicyFormOpen: true }),
  onPolicyFormClose: () => set({ isPolicyFormOpen: false }),
  //SHARE
  isShareFormOpen: false,
  onShareFormOpen: (l, n, u, f) =>
    set({
      leadIds: l,
      leadFullName: n,
      initUser: u,
      isShareFormOpen: true,
      onTableClose: f,
    }),
  onShareFormClose: () =>
    set({
      leadIds: [],
      leadFullName: "",
      initUser: null,
      isShareFormOpen: false,
    }),
  //TRANSFER
  isTransferFormOpen: false,
  onTransferFormOpen: (l, n, f) =>
    set({
      leadIds: l,
      leadFullName: n,
      isTransferFormOpen: true,
      onTableClose: f,
    }),
  onTransferFormClose: () =>
    set({
      leadIds: [],
      isTransferFormOpen: false,
    }),

  //ASSISTANT
  isAssistantFormOpen: false,
  onAssistantFormOpen: (l, n, u?) =>
    set({
      leadId: l,
      leadFullName: n,
      initUser: u,
      isAssistantFormOpen: true,
    }),
  onAssistantFormClose: () =>
    set({
      leadId: undefined,
      isAssistantFormOpen: false,
    }),
  //INTAKE
  isIntakeFormOpen: false,
  onIntakeFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isIntakeFormOpen: true }),
  onIntakeFormClose: () =>
    set({
      leadId: undefined,
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

export const useLeadData = () => {
  const { leadId } = useLeadId();
  const [edit, setEdit] = useState(false);
  const [defaultNumber, setDefaultNumber] = useState("");

  // const invalidate = (queries: string[]) => {
  //   queries.forEach((query) => {
  //     queryClient.invalidateQueries({ queryKey: [query] });
  //   });
  // };

  const { data: lead, isFetching: isFetchingLead } = useQuery<FullLead | null>({
    queryFn: () => leadGetById(leadId),
    queryKey: [`lead-${leadId}`],
  });

  const { data: prevNext, isFetching: isFetchingnextPrev } =
    useQuery<LeadPrevNext | null>({
      queryFn: () => leadGetPrevNextById(leadId),
      queryKey: [`leadNextPrev-${leadId}`],
    });

  const { data: calls, isFetching: isFetchingCalls } = useQuery<FullCall[]>({
    queryFn: () => callsGetAllByLeadId(leadId),
    queryKey: [`leadCalls-${leadId}`],
  });

  const { data: initActivities, isFetching: isFetchingActivities } = useQuery<
    Activity[]
  >({
    queryFn: () => leadActivitiesGet(leadId),
    queryKey: [`leadActivities-${leadId}`],
  });

  const { data: appointments, isFetching: isFetchingAppointments } = useQuery<
    Appointment[]
  >({
    queryFn: () => leadAppointmentsGet(leadId),
    queryKey: [`leadAppointments-${leadId}`],
  });

  const onSetDefaultNumber = async (phoneNumber: string) => {
    if (phoneNumber != defaultNumber) {
      setDefaultNumber(phoneNumber);
      const updatedNumber = await leadUpdateByIdDefaultNumber(
        leadId,
        phoneNumber
      );

      if (updatedNumber.success) {
        toast.success(updatedNumber.success);
      } else toast.error(updatedNumber.error);
    }
    setEdit(false);
  };
  useEffect(() => {
    if (!lead) return;
    setDefaultNumber(lead.defaultNumber);
  }, [lead]);
  return {
    lead,
    isFetchingLead,
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
    prevNext,
    isFetchingnextPrev,
    calls,
    isFetchingCalls,
    initActivities,
    isFetchingActivities,
    appointments,
    isFetchingAppointments,
  };
};

export const useLeadActions = (
  onClose: () => void,
  leadIds?: string[],
  uId?: string,
  onTableClose?: () => void
) => {
  const user = useCurrentUser();
  const { socket } = useContext(SocketContext).SocketState;
  const [userId, setUserId] = useState(uId);
  const [loading, setLoading] = useState(false);
  //SHARING
  const onLeadUpdateByIdShare = async () => {
    if (!leadIds || !userId) return;
    setLoading(true);
    const updatedShare = await leadUpdateByIdShare(leadIds, userId);

    if (updatedShare.success) {
      socket?.emit(
        "lead-shared",
        userId,
        user?.name,
        leadIds,
        updatedShare.success
      );
      toast.success(updatedShare.message);
      if (onTableClose) onTableClose();
      onClose();
    } else toast.error(updatedShare.error);
    setLoading(false);
  };

  const onLeadUpdateByIdUnShare = async () => {
    if (!leadIds) return;
    const leadId = leadIds[0];
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
    if (!leadIds || !userId) return;

    setLoading(true);
    const transferedLead = await leadUpdateByIdTransfer(leadIds, userId);
    if (transferedLead.success) {
      socket?.emit(
        "lead-transfered",
        userId,
        user?.name,
        leadIds,
        transferedLead.success
      );
      userEmitter.emit("leadTransfered", leadIds);

      toast.success(transferedLead.message);
      if (onTableClose) onTableClose();
      onClose();
    } else toast.error(transferedLead.error);
    setLoading(false);
  };

  //ASSISTANT
  const onLeadUpdateByIdAssistantAdd = async () => {
    if (!leadIds) return;
    const leadId = leadIds[0];
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
    if (!leadIds) return;
    const leadId = leadIds[0];
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
      console.log(values);
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

export const useLeadMainInfoActions = (
  onClose?: () => void,
  noConvo: boolean = false
) => {
  const router = useRouter();
  const { leadId } = useLead();
  const [initConvo, setInitConvo] = useState(noConvo);
  const [loading, setLoading] = useState(false);

  const { data: mainInfo, isFetching: isFetchingMainInfo } =
    useQuery<LeadMainSchemaTypeP | null>({
      queryFn: () => leadGetByIdMain(leadId as string),
      queryKey: [`leadMainInfo-${leadId}`],
    });

  // const onSetInfo = (e: LeadMainSchemaType) => {
  //   if (e.id == info.id) setLeadInfo(e);
  // };

  const onLeadUpdateByIdQuote = async (e?: string) => {
    if (!e) {
      return;
    }
    const updatedQuote = await leadUpdateByIdQuote(leadId as string, e);
    if (updatedQuote.success) {
      toast.success(updatedQuote.success);
    } else toast.error(updatedQuote.error);
  };

  const onLeadSendInitialSms = async (leadId:string) => {
    const createdSms = await smsCreateInitial(leadId);
    router.refresh();
    if (createdSms.success) {
      setInitConvo(true);
      toast.success(createdSms.success);
    } else toast.error(createdSms.error);
  };

  //MAIN INFO
  const onMainInfoUpdate = async (values: LeadMainSchemaType) => {
    setLoading(true);
    const response = await leadUpdateByIdMainInfo(values);
    if (response.success) {
      userEmitter.emit("mainInfoUpdated", response.success);
      toast.success("Lead demographic info updated");
      if (onClose) onClose();
    } else {
      toast.error(response.error);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   userEmitter.on("mainInfoUpdated", (info) => onSetInfo(info));
  // }, [info]);

  return {
    mainInfo,
    isFetchingMainInfo,
    initConvo,
    onLeadUpdateByIdQuote,
    onLeadSendInitialSms,
    loading,
    onMainInfoUpdate,
  };
};

export const useLeadGeneralInfoActions = (onClose?: () => void) => {
  const { leadId } = useLead();
  const [loading, setLoading] = useState(false);

  const { data: generalInfo, isFetching: isFetchingGeneralInfo } =
    useQuery<LeadGeneralSchemaTypeP | null>({
      queryFn: () => leadGetByIdGeneral(leadId as string),
      queryKey: [`leadGeneralInfo-${leadId}`],
    });

  //GENERAL INFO
  const onGeneralInfoUpdate = async (values: LeadGeneralSchemaType) => {
    setLoading(true);
    const updatedLead = await leadUpdateByIdGeneralInfo(values);

    if (updatedLead.success) {
      userEmitter.emit("generalInfoUpdated", updatedLead.success);
      if (onClose) onClose();
    } else toast.error(updatedLead.error);

    setLoading(false);
  };

  return {
    generalInfo,
    isFetchingGeneralInfo,
    loading,
    onGeneralInfoUpdate,
  };
};

export const useLeadId = () => {
  const params = useParams();
  const leadId = useMemo(() => {
    if (!params?.id) {
      return "";
    }

    return params?.id as string;
  }, [params?.id]);

  return useMemo(
    () => ({
      leadId,
    }),
    [leadId]
  );
};
