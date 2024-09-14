import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SocketContext from "@/providers/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import {
  Call,
  LeadBeneficiary,
  User,
} from "@prisma/client";
import {  FullLead, LeadPrevNext } from "@/types";

import {
  leadGetByIdBasicInfo,
  leadGetByIdCallInfo,
  leadGetByIdGeneral,
  leadGetByIdMain,
  leadGetByIdNotes,
  leadGetByIdPolicy,
  leadUpdateByIdAssistantAdd,
  leadUpdateByIdAssistantRemove,
  leadUpdateByIdDefaultNumber,
  leadUpdateByIdGeneralInfo,
  leadUpdateByIdMainInfo,
  leadUpdateByIdNotes,
  leadUpdateByIdPolicyInfo,
  leadUpdateByIdQuote,
  leadUpdateByIdShare,
  leadUpdateByIdTransfer,
  leadUpdateByIdUnShare,
} from "@/actions/lead";
import { useCurrentUser } from "../use-current-user";
import { useQuery } from "@tanstack/react-query";
import {
  IntakeBankInfoSchemaType,
  IntakeDoctorInfoSchemaType,
  IntakeMedicalInfoSchemaType,
  IntakeOtherInfoSchemaType,
  IntakePersonalInfoSchemaType,
  LeadBasicInfoSchemaTypeP,
  LeadCallInfoSchemaTypeP,
  LeadGeneralSchemaType,
  LeadGeneralSchemaTypeP,
  LeadMainSchemaType,
  LeadMainSchemaTypeP,
  LeadNotesSchemaTypeP,
  LeadPolicySchemaType,
  LeadPolicySchemaTypeP,
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

import { leadGetById, leadGetPrevNextById } from "@/actions/lead";

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
  setLeadId: (l: string) => void;
  //ConversationId
  conversationId?:string;
  setConversationId:(c?:string)=>void
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
  onPolicyFormOpen: (l: string) => void;
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

export const useLeadStore = create<useLeadStore>((set) => ({
  setLeadId: (l) => set({ leadId: l }),
  setConversationId:(c)=> set({ conversationId: c }),
  isMainFormOpen: false,
  onMainFormOpen: (l) => set({ leadId: l, isMainFormOpen: true }),
  onMainFormClose: () => set({ isMainFormOpen: false }),
  isGeneralFormOpen: false,
  onGeneralFormOpen: (l) => set({ leadId: l, isGeneralFormOpen: true }),
  onGeneralFormClose: () => set({ isGeneralFormOpen: false }),
  isPolicyFormOpen: false,
  onPolicyFormOpen: (l) => set({ leadId: l, isPolicyFormOpen: true }),
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
  const { leadId,setConversationId: setConverationId } = useLeadStore();
  const [edit, setEdit] = useState(false);
  const [defaultNumber, setDefaultNumber] = useState("");

  // const invalidate = (queries: string[]) => {
  //   queries.forEach((query) => {
  //     queryClient.invalidateQueries({ queryKey: [query] });
  //   });
  // };

  const { data: leadBasic, isFetching: isFetchingLeadBasic } =
    useQuery<LeadBasicInfoSchemaTypeP | null>({
      queryFn: () => leadGetByIdBasicInfo(leadId as string),
      queryKey: [`leadBasic-${leadId}`],
    });

  const { data: lead, isFetching: isFetchingLead } = useQuery<FullLead | null>({
    queryFn: () => leadGetById(leadId as string),
    queryKey: [`lead-${leadId}`],
  });

  const { data: prevNext, isFetching: isFetchingnextPrev } =
    useQuery<LeadPrevNext | null>({
      queryFn: () => leadGetPrevNextById(leadId as string),
      queryKey: [`leadNextPrev-${leadId}`],
    });  
 

  const onSetDefaultNumber = async (phoneNumber: string) => {
    if (phoneNumber != defaultNumber) {
      setDefaultNumber(phoneNumber);
      const updatedNumber = await leadUpdateByIdDefaultNumber(
        leadId as string,
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

   useEffect(() => {
    if (!leadBasic) return;
    setConverationId(leadBasic.conversations[0]?.id);
  }, [leadBasic]);

  return {
    leadId,
    leadBasic,
    isFetchingLeadBasic,
    lead,
    isFetchingLead,
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
    prevNext,
    isFetchingnextPrev,
  };
};

export const useLeadActions = (uId?: string) => {
  const user = useCurrentUser();
  const { socket } = useContext(SocketContext).SocketState;
  const {
    isShareFormOpen,
    onShareFormClose,
    isTransferFormOpen,
    onTransferFormClose,
    isAssistantFormOpen,
    onAssistantFormClose,
    leadIds,
    leadFullName,
    initUser,
    onTableClose,
  } = useLeadStore();
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
      onShareFormClose();
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
      onShareFormClose();
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
      onTransferFormClose();
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
      onAssistantFormClose();
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
      onAssistantFormClose();
    } else toast.error(updatedAssistant.error);

    setLoading(false);
  };

  return {
    userId,
    setUserId,
    loading,
    leadFullName,
    initUser,
    leadIds,
    isShareFormOpen,
    onShareFormClose,
    isTransferFormOpen,
    onTransferFormClose,
    isAssistantFormOpen,
    onAssistantFormClose,
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
    medicalIsPending,
    onMedicalSubmit,
  };
};

export const useLeadMainInfoActions = (
  onClose?: () => void,
  noConvo: boolean = false
) => {
  const { leadId } = useLeadStore();
  const queryClient = useQueryClient();
  const [initConvo, setInitConvo] = useState(noConvo);
  const [loading, setLoading] = useState(false);

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  const { data: mainInfo, isFetching: isFetchingMainInfo } =
    useQuery<LeadMainSchemaTypeP | null>({
      queryFn: () => leadGetByIdMain(leadId as string),
      queryKey: [`leadMainInfo-${leadId}`],
    });

  const onLeadUpdateByIdQuote = async (e?: string) => {
    if (!e) {
      return;
    }
    const updatedQuote = await leadUpdateByIdQuote(leadId as string, e);
    if (updatedQuote.success) {
      toast.success(updatedQuote.success);
    } else toast.error(updatedQuote.error);
  }; 

  //MAIN INFO
  const onMainInfoUpdate = async (values: LeadMainSchemaType) => {
    setLoading(true);
    const response = await leadUpdateByIdMainInfo(values);
    if (response.success) {
      userEmitter.emit("mainInfoUpdated", response.success);
      toast.success("Lead demographic info updated");
      [`leadMainInfo-${leadId}`, `lead-${leadId}`].forEach((key) =>
        invalidate(key)
      );
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
    loading,
    onMainInfoUpdate,
  };
};

export const useLeadGeneralInfoActions = (onClose?: () => void) => {
  const { leadId } = useLeadStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`leadGeneralInfo-${leadId}`] });
  };

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
      invalidate();
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

export const useLeadPolicyActions = () => {
  const { leadId, isPolicyFormOpen, onPolicyFormClose } = useLeadStore();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`leadPolicy-${leadId}`] });
  };

  //POLICY
  const { data: policy, isFetching: isFetchingPolicy } =
    useQuery<LeadPolicySchemaTypeP | null>({
      queryFn: () => leadGetByIdPolicy(leadId as string),
      queryKey: [`leadPolicy-${leadId}`],
    });

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
        onPolicyFormClose();
        invalidate();
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

  return {
    policy,
    isFetchingPolicy,
    isPolicyFormOpen,
    onPolicyFormClose,
    onPolicySubmit,
    policyIsPending,
  };
};

export const useLeadNotesActions = () => {
  const { leadId } = useLeadStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState<string | null>("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`leadNotes-${leadId}`] });
  };

  const { data: initNotes, isFetching: isFetchingNotes } =
    useQuery<LeadNotesSchemaTypeP | null>({
      queryFn: () => leadGetByIdNotes(leadId as string),
      queryKey: [`leadNotes-${leadId}`],
    });

  //NOTES
  const onNotesUpdated = async () => {
    if (!notes || notes == initNotes?.notes) return;
    setLoading(true);
    const updatedNotes = await leadUpdateByIdNotes(leadId as string, notes);

    if (updatedNotes.success) toast.success("Lead notes have been updated");
    else toast.error(updatedNotes.error);
    setLoading(false);
  };

  //UNSAHRE USER
  const onUnShareLead = async () => {
    const updatedLead = await leadUpdateByIdUnShare(leadId as string);
    if (updatedLead.success) {
      invalidate();
      toast.success(updatedLead.message);
    } else toast.error(updatedLead.error);
  };

  useEffect(() => {
    if (!initNotes) return;
    setNotes(initNotes.notes);
  }, [initNotes]);

  return {
    loading,
    initNotes,
    notes,
    setNotes,
    isFetchingNotes,
    onNotesUpdated,
    onUnShareLead,
  };
};

export const useLeadCallInfoActions = () => {
  const { leadId } = useLeadStore();
  const queryClient = useQueryClient();
  const { socket } = useContext(SocketContext).SocketState;
  //CallInfo
  const { data: callInfo, isFetching: isFetchingCallInfo } =
    useQuery<LeadCallInfoSchemaTypeP | null>({
      queryFn: () => leadGetByIdCallInfo(leadId as string),
      queryKey: [`leadCallInfo-${leadId}`],
    });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`leadPolicy-${leadId}`] });
  };

  useEffect(() => {
    socket?.on("calllog:new", (data: { dt: Call }) => {
      if (data.dt.leadId == leadId) invalidate();
    });
    return () => {
      socket?.off("calllog:new", (data: { dt: Call }) => {
        if (data.dt.leadId == leadId) invalidate();
      });
    };
  }, []);

  return {
    callInfo,
    isFetchingCallInfo,
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
