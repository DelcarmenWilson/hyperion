import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "../user/use-current";
import SocketContext from "@/providers/socket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import { Call, Lead, User } from "@prisma/client";
import { AssociatedLead, FullLead, LeadPrevNext } from "@/types";
import {
  LeadBasicInfoSchemaTypeP,
  LeadCallInfoSchemaTypeP,
  LeadGeneralSchemaType,
  LeadGeneralSchemaTypeP,
  LeadMainSchemaType,
  LeadMainSchemaTypeP,
  LeadNotesSchemaTypeP,
  LeadPolicySchemaType,
  LeadSchemaType,
} from "@/schemas/lead";

import {
  createLead,
  getAssociatedLeads,
  getLead,
  getLeads,
  getLeadBasicInfo,
  getLeadCallInfo,
  getLeadGeneralInfo,
  getLeadMainInfo,
  getLeadNotes,
  getLeadPrevNext,
  getMultipleLeads,
  addLeadAssistant,
  removeLeadAssistant,
  updateLeadDefaultNumber,
  updateLeadGeneralInfo,
  updateLeadMainInfo,
  updateLeadNotes,
  updateLeadQuote,
  shareLead,
  unshareLead,
  transferLead,
} from "@/actions/lead";

type DialogType =
  | "personal"
  | "doctor"
  | "bank"
  | "other"
  | "policy"
  | "medical";
type State = {
  leadId?: string;
  leadIds?: string[];
  leadFullName?: string;
  associatedLead: boolean;
  //ConversationId
  conversationId?: string;
  //MAIN INFO
  isMainFormOpen: boolean;
  //GENERAL INFO
  isGeneralFormOpen: boolean;
  //POLICY
  policyInfo?: LeadPolicySchemaType;
  isPolicyFormOpen: boolean;
  // SHARE
  initUser?: User | null;
  isShareFormOpen: boolean;
  //TRANSFER
  isTransferFormOpen: boolean;
  //ASSISTANT
  isAssistantFormOpen: boolean;
  //INTAKE FORM
  isIntakeFormOpen: boolean;
  dialogType: DialogType;
  isIntakeDialogOpen: boolean;
  //NEW LEAD FORM
  isNewLeadFormOpen: boolean;
  //EXPORT LEAD FORM
  isExportFormOpen: boolean;
  //IMPORT LEAD FORM
  isImportFormOpen: boolean;
  //MULTIPLE LEAD DIALOG
  isMultipleLeadDialogOpen: boolean;
};
type Actions = {
  onTableClose?: () => void;
  setLeadId: (l?: string) => void;
  //ConversationId
  setConversationId: (c?: string) => void;
  //MAIN INFO
  onMainFormOpen: (l: string) => void;
  onMainFormClose: () => void;
  //GENERAL INFO
  onGeneralFormOpen: (l: string) => void;
  onGeneralFormClose: () => void;
  //POLICY
  onPolicyFormOpen: (l: string, n: string) => void;
  onPolicyFormClose: () => void;
  // SHARE
  onShareFormOpen: (l: string[], n: string, u?: User, f?: () => void) => void;
  onShareFormClose: () => void;
  //TRANSFER
  onTransferFormOpen: (l: string[], n: string, f?: () => void) => void;
  onTransferFormClose: () => void;
  //ASSISTANT
  //TODO - this should be multiple leads
  onAssistantFormOpen: (l: string, n: string, u?: User) => void;
  onAssistantFormClose: () => void;
  //INTAKE FORM
  onIntakeFormOpen: (l: string, n: string) => void;
  onIntakeFormClose: () => void;
  onIntakeDialogOpen: (d: DialogType) => void;
  onIntakeDialogClose: () => void;
  //NEW LEAD FORM
  onNewLeadFormOpen: (a: boolean) => void;
  onNewLeadFormClose: () => void;
  //EXPORT LEAD FORM
  onExportFormOpen: () => void;
  onExportFormClose: () => void;
  //IMPORT LEAD FORM
  onImportFormOpen: () => void;
  onImportFormClose: () => void;

  //MULTIPLE LEAD DIALOG
  onMultipleLeadDialogOpen: (ids: string[]) => void;
  onMultipleLeadDialogClose: () => void;
};

export const useLeadStore = create<State & Actions>((set) => ({
  associatedLead: false,
  setLeadId: (l) => set({ leadId: l }),
  setConversationId: (c) => set({ conversationId: c }),
  isMainFormOpen: false,
  onMainFormOpen: (l) => set({ leadId: l, isMainFormOpen: true }),
  onMainFormClose: () => set({ isMainFormOpen: false }),
  isGeneralFormOpen: false,
  onGeneralFormOpen: (l) => set({ leadId: l, isGeneralFormOpen: true }),
  onGeneralFormClose: () => set({ isGeneralFormOpen: false }),
  isPolicyFormOpen: false,
  onPolicyFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isPolicyFormOpen: true }),
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
  onTransferFormClose: () => set({ leadIds: [], isTransferFormOpen: false }),
  //ASSISTANT
  isAssistantFormOpen: false,
  onAssistantFormOpen: (l, n, u?) =>
    set({ leadId: l, leadFullName: n, initUser: u, isAssistantFormOpen: true }),
  onAssistantFormClose: () => set({ isAssistantFormOpen: false }),
  //INTAKE
  isIntakeFormOpen: false,
  onIntakeFormOpen: (l, n) =>
    set({ leadId: l, leadFullName: n, isIntakeFormOpen: true }),
  onIntakeFormClose: () => set({ isIntakeFormOpen: false }),

  dialogType: "personal",
  isIntakeDialogOpen: false,
  onIntakeDialogOpen: (d: DialogType) =>
    set({ dialogType: d, isIntakeDialogOpen: true }),
  onIntakeDialogClose: () => set({ isIntakeDialogOpen: false }),
  //NEW LEAD FORM
  isNewLeadFormOpen: false,
  onNewLeadFormOpen: (a: boolean) =>
    set({ isNewLeadFormOpen: true, associatedLead: a }),
  onNewLeadFormClose: () =>
    set({ isNewLeadFormOpen: false, associatedLead: false }),
  //EDXPORT LEAD FORM
  isExportFormOpen: false,
  onExportFormOpen: () => set({ isExportFormOpen: true }),
  onExportFormClose: () => set({ isExportFormOpen: false }),
  //IMPORT LEAD FORM
  isImportFormOpen: false,
  onImportFormOpen: () => set({ isImportFormOpen: true }),
  onImportFormClose: () => set({ isImportFormOpen: false }),
  //MULTIPLE LEAD DIALOG
  isMultipleLeadDialogOpen: false,
  onMultipleLeadDialogOpen: (ids) =>
    set({ leadIds: ids, isMultipleLeadDialogOpen: true }),
  onMultipleLeadDialogClose: () =>
    set({ leadIds: undefined, isMultipleLeadDialogOpen: false }),
}));

export const useLeadData = () => {
  const { leadIds, setConversationId } = useLeadStore();
  const [edit, setEdit] = useState(false);
  const [defaultNumber, setDefaultNumber] = useState("");

  const onGetLeadBasicInfo = (leadId: string) => {
    const {
      data: leadBasic,
      isFetching: leadBasicFetching,
      isLoading: leadBasicLoading,
    } = useQuery<LeadBasicInfoSchemaTypeP | null>({
      queryFn: () => getLeadBasicInfo(leadId),
      queryKey: [`lead-basic-${leadId}`],
      enabled: !!leadId,
    });
    return {
      leadBasic,
      leadBasicFetching,
      leadBasicLoading,
    };
  };
  const onGetLead = (leadId: string) => {
    const {
      data: lead,
      isFetching: leadFetching,
      isLoading: leadLoading,
    } = useQuery<FullLead | null>({
      queryFn: () => getLead(leadId as string),
      queryKey: [`lead-${leadId}`],
      enabled: !!leadId,
    });
    return {
      lead,
      leadFetching,
      leadLoading,
    };
  };

  const onGetLeads = () => {
    const {
      data: leads,
      isFetching: leadsFetching,
      isLoading: leadsLoading,
    } = useQuery<FullLead[] | []>({
      queryFn: () => getLeads(),
      queryKey: ["leads"],
    });

    return {
      leads,
      leadsFetching,
      leadsLoading,
    };
  };

  const onGetMultipleLeads = () => {
    const {
      data: leads,
      isFetching: leadsFetching,
      isLoading: leadsLoading,
    } = useQuery<Lead[] | []>({
      queryFn: () => getMultipleLeads({ leadIds }),
      queryKey: [`leads-${leadIds}`],
      enabled: !!leadIds,
    });

    return {
      leads,
      leadsFetching,
      leadsLoading,
    };
  };
  const onGetLeadPrevNext = (leadId: string) => {
    const {
      data: prevNext,
      isFetching: nextPrevFetching,
      isLoading: leadPrevNextLoading,
    } = useQuery<LeadPrevNext | null>({
      queryFn: () => getLeadPrevNext(leadId),
      queryKey: [`leadNextPrev-${leadId}`],
      enabled: !!leadId,
    });
    return {
      prevNext,
      nextPrevFetching,
      leadPrevNextLoading,
    };
  };
  const onGetAssociatedLeads = (leadId: string) => {
    const {
      data: associatedLeads,
      isFetching: associatedLeadsFetching,
      isLoading: associatedLeadsLoading,
    } = useQuery<AssociatedLead[] | []>({
      queryFn: () => getAssociatedLeads(leadId),
      queryKey: [`lead-associated-${leadId}`],
      enabled: !!leadId,
    });
    return {
      associatedLeads,
      associatedLeadsFetching,
      associatedLeadsLoading,
    };
  };

  const onSetDefaultNumber = async (leadId: string, phoneNumber: string) => {
    if (phoneNumber != defaultNumber) {
      setDefaultNumber(phoneNumber);
      const updatedNumber = await updateLeadDefaultNumber({
        id: leadId,
        defaultNumber: phoneNumber,
      });

      if (updatedNumber) toast.success(updatedNumber);
      else toast.error("Something went wrong!");
    }
    setEdit(false);
  };
  // useEffect(() => {
  //   if (!lead) return;
  //   setDefaultNumber(lead.defaultNumber);
  // }, [lead]);

  // useEffect(() => {
  //   if (!leadBasic) return;
  //   setConversationId(leadBasic.conversations[0]?.id);
  // }, [leadBasic]);

  return {
    edit,
    setEdit,
    defaultNumber,
    onSetDefaultNumber,
    onGetLeadBasicInfo,
    onGetLead,
    onGetLeads,
    onGetMultipleLeads,
    onGetLeadPrevNext,
    onGetAssociatedLeads,
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
    const updatedShare = await shareLead({ ids: leadIds, userId });

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
    } else toast.error("Something went wrong!");
    setLoading(false);
  };

  const onLeadUpdateByIdUnShare = async () => {
    if (!leadIds) return;
    const leadId = leadIds[0];
    if (!leadId) return;

    setLoading(true);
    const updatedShare = await unshareLead(leadId);

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
    } else toast.error("Something went wrong");

    setLoading(false);
  };
  //TRANSFER
  const onLeadUpdateByIdTransfer = async () => {
    if (!leadIds || !userId) return;

    setLoading(true);
    const transferedLead = await transferLead({ ids: leadIds, userId });
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
    } else toast.error("Something went wrong!");
    setLoading(false);
  };

  //ASSISTANT
  const onLeadUpdateByIdAssistantAdd = async () => {
    if (!leadIds) return;
    const leadId = leadIds[0];
    if (!leadId || !userId) return;
    setLoading(true);
    const updatedAssistant = await addLeadAssistant({
      id: leadId,
      assistantId: userId,
    });
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
    } else toast.error("Something went wrong!");

    setLoading(false);
  };

  const onLeadUpdateByIdAssistantRemove = async () => {
    if (!leadIds) return;
    const leadId = leadIds[0];
    if (!leadId) return;
    setLoading(true);
    const updatedAssistant = await removeLeadAssistant(leadId);
    if (updatedAssistant.success) {
      toast.success(updatedAssistant.message);
      onAssistantFormClose();
    } else toast.error("Something went wrong");

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

export const useLeadInsertActions = () => {
  const { leadId, onNewLeadFormClose } = useLeadStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`lead-associated-${leadId}`] });
  };

  //NEW LEAD
  const { mutate: leadInsertMutate, isPending: leadInsertIsPending } =
    useMutation({
      mutationFn: createLead,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("New lead created", { id: "insert-new-lead" });
          onNewLeadFormClose();
          if (!results.associated) router.push(`/leads/${results.success.id}`);
        } else {
          toast.error("Something went wrong", { id: "insert-new-lead" });
        }
      },
      onError: (error) => toast.error(error.message, { id: "insert-new-lead" }),
      onSettled: () => invalidate(),
    });

  const onLeadInsertMutate = useCallback(
    (values: LeadSchemaType) => {
      toast.loading("Creating new lead...", { id: "insert-new-lead" });
      leadInsertMutate(values);
    },
    [leadInsertMutate]
  );

  return {
    onLeadInsertMutate,
    leadInsertIsPending,
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
    queryClient.invalidateQueries({ queryKey: [`${key}-${leadId}`] });
  };
  const { data: mainInfo, isFetching: isFetchingMainInfo } =
    useQuery<LeadMainSchemaTypeP | null>({
      queryFn: () => getLeadMainInfo(leadId as string),
      queryKey: [`lead-main-info-${leadId}`],
      enabled: !!leadId,
    });

  const onLeadUpdateByIdQuote = async (e?: string) => {
    if (!e) {
      return;
    }
    const updatedQuote = await updateLeadQuote({
      id: leadId as string,
      quote: e,
    });
    if (updatedQuote) {
      toast.success(updatedQuote);
    } else toast.error("Something wentwrong");
  };

  //MAIN INFO
  const onMainInfoUpdate = async (values: LeadMainSchemaType) => {
    setLoading(true);
    const response = await updateLeadMainInfo(values);
    if (response) {
      userEmitter.emit("mainInfoUpdated", response);
      toast.success("Lead demographic info updated");
      ["lead-main-info", "lead"].forEach((key) => invalidate(key));
      if (onClose) onClose();
    } else {
      toast.error("Something went wrong");
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
    queryClient.invalidateQueries({
      queryKey: [`lead-general-info-${leadId}`],
    });
  };

  const { data: generalInfo, isFetching: isFetchingGeneralInfo } =
    useQuery<LeadGeneralSchemaTypeP | null>({
      queryFn: () => getLeadGeneralInfo(leadId as string),
      queryKey: [`lead-general-info-${leadId}`],
      enabled: !!leadId,
    });

  //GENERAL INFO
  const onGeneralInfoUpdate = async (values: LeadGeneralSchemaType) => {
    setLoading(true);
    const updatedLead = await updateLeadGeneralInfo(values);

    if (updatedLead) {
      userEmitter.emit("generalInfoUpdated", updatedLead);
      invalidate();
      if (onClose) onClose();
    } else toast.error("Something went wrong");

    setLoading(false);
  };

  return {
    generalInfo,
    isFetchingGeneralInfo,
    loading,
    onGeneralInfoUpdate,
  };
};

export const useLeadNotesActions = () => {
  const { leadId } = useLeadStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState<string | null>("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`lead-notes-${leadId}`] });
  };

  const { data: initNotes, isFetching: isFetchingNotes } =
    useQuery<LeadNotesSchemaTypeP | null>({
      queryFn: () => getLeadNotes(leadId as string),
      queryKey: [`lead-notes-${leadId}`],
      enabled: !!leadId,
    });

  //NOTES
  const onNotesUpdated = async () => {
    if (!notes || notes == initNotes?.notes) return;
    setLoading(true);
    const updatedNotes = await updateLeadNotes({ id: leadId as string, notes });

    if (updatedNotes.success) toast.success("Lead notes have been updated");
    else toast.error("Something went wrong");
    setLoading(false);
  };

  //UNSAHRE USER
  const onUnShareLead = async () => {
    const updatedLead = await unshareLead(leadId as string);
    if (updatedLead.success) {
      invalidate();
      toast.success(updatedLead.message);
    } else toast.error("Something went wrong!");
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
      queryFn: () => getLeadCallInfo(leadId as string),
      queryKey: [`lead-call-info-${leadId}`],
      enabled: !!leadId,
    });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`lead-call-info-${leadId}`] });
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
