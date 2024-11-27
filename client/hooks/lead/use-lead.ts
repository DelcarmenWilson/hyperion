import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import SocketContext from "@/providers/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { create } from "zustand";

import { Call, User } from "@prisma/client";
import { AssociatedLead, FullLead, LeadPrevNext } from "@/types";

import {
  leadGetByIdBasicInfo,
  leadGetByIdCallInfo,
  leadGetByIdGeneral,
  leadGetByIdMain,
  leadGetByIdNotes,
  leadInsert,
  leadsGetAssociated,
  leadUpdateByIdAssistantAdd,
  leadUpdateByIdAssistantRemove,
  leadUpdateByIdDefaultNumber,
  leadUpdateByIdGeneralInfo,
  leadUpdateByIdMainInfo,
  leadUpdateByIdNotes,
  leadUpdateByIdQuote,
  leadUpdateByIdShare,
  leadUpdateByIdTitan,
  leadUpdateByIdTransfer,
  leadUpdateByIdUnShare,
} from "@/actions/lead";
import { useCurrentUser } from "../user/use-current";
import { useQuery } from "@tanstack/react-query";
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
import { leadGetById, leadGetPrevNextById } from "@/actions/lead";

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
  onPolicyFormOpen: (l: string,n:string) => void;
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
  onPolicyFormOpen: (l,n) => set({ leadId: l,leadFullName:n, isPolicyFormOpen: true }),
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
}));

export const useLeadData = () => {
  const { leadId, setConversationId } = useLeadStore();
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
      queryKey: [`lead-basic-${leadId}`],
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
    setConversationId(leadBasic.conversations[0]?.id);
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

export const useLeadAssociatedData = () => {
  const { leadId } = useLeadStore();

  const { data: leadsAssociated, isFetching: isFetchingLeadsAssociated } =
    useQuery<AssociatedLead[] | []>({
      queryFn: () => leadsGetAssociated(leadId as string),
      queryKey: [`lead-associated-${leadId}`],
    });

  return {
    leadsAssociated,
    isFetchingLeadsAssociated,
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
      mutationFn: leadInsert,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("New lead created", { id: "insert-new-lead" });
          onNewLeadFormClose();
          if (!results.associated) router.push(`/leads/${results.success.id}`);
        } else {
          toast.error(results.error, { id: "insert-new-lead" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
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
      queryFn: () => leadGetByIdMain(leadId as string),
      queryKey: [`lead-main-info-${leadId}`],
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
      ["lead-main-info", "lead"].forEach((key) => invalidate(key));
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
    queryClient.invalidateQueries({
      queryKey: [`lead-general-info-${leadId}`],
    });
  };

  const { data: generalInfo, isFetching: isFetchingGeneralInfo } =
    useQuery<LeadGeneralSchemaTypeP | null>({
      queryFn: () => leadGetByIdGeneral(leadId as string),
      queryKey: [`lead-general-info-${leadId}`],
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
      queryFn: () => leadGetByIdNotes(leadId as string),
      queryKey: [`lead-notes-${leadId}`],
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
      queryKey: [`lead-call-info-${leadId}`],
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
