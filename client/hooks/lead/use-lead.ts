import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "../user/use-current";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useSocketStore } from "../use-socket-store";
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
//TODO - see if we can use the mutation for all of these functions
export const useLeadActions = (uId?: string) => {
  const user = useCurrentUser();
  const { socket } =useSocketStore()
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

export const useLeadInfoData = (leadId: string) => {
  //MAIN INFO
  const onGetLeadMainInfo = () => {
    const {
      data: mainInfo,
      isFetching: mainInfoFetching,
      isLoading: mainInfoLoading,
    } = useQuery<LeadMainSchemaTypeP | null>({
      queryFn: () => getLeadMainInfo(leadId),
      queryKey: [`lead-main-info-${leadId}`],
      enabled: !!leadId,
    });
    return {
      mainInfo,
      mainInfoFetching,
      mainInfoLoading,
    };
  };

  // GENERAL INFO
  const onGetLeadGeneralInfo = () => {
    const {
      data: generalInfo,
      isFetching: generalInfoFetching,
      isLoading: generalInfoLoading,
    } = useQuery<LeadGeneralSchemaTypeP | null>({
      queryFn: () => getLeadGeneralInfo(leadId as string),
      queryKey: [`lead-general-info-${leadId}`],
      enabled: !!leadId,
    });
    return {
      generalInfo,
      generalInfoFetching,
      generalInfoLoading,
    };
  };
  return {
    onGetLeadMainInfo,
    onGetLeadGeneralInfo,
  };
};

export const useLeadInfoActions = (cb?: () => void) => {
  const { invalidate } = useInvalidate();

  //UPDATE Quote
  const { mutate: onLeadUpdateQuote, isPending: leadQuoteUpdating } =
    useMutation({
      mutationFn: updateLeadQuote,
      onSuccess: () => toast.success("Quote Udpated!", { id: "update-quote" }),

      onError: (error) => toast.error(error.message, { id: "update-quote" }),
    });

  //MAIN INFO
  const { mutate: updateLeadMainInfoMutate, isPending: mainInfoUpdating } =
    useMutation({
      mutationFn: updateLeadMainInfo,
      onSuccess: (results) => {
        if (results) {
          toast.success("Main info updated", { id: "update-main-info" });
          [`lead-main-info-${results}`, `lead-${results}`].forEach((key) =>
            invalidate(key)
          );
        }
        if (cb) cb();
      },
      onError: (error) =>
        toast.error(error.message, { id: "update-main-info" }),
    });

  const onUpdateLeadMainInfo = useCallback(
    (values: LeadMainSchemaType) => {
      toast.loading("Updating main info...", { id: "update-main-info" });
      updateLeadMainInfoMutate(values);
    },
    [updateLeadMainInfoMutate]
  );

  //GENERAL INFO
  const {
    mutate: updateLeadGeneralInfoMutate,
    isPending: generalInfoUpdating,
  } = useMutation({
    mutationFn: updateLeadGeneralInfo,
    onSuccess: (results) => {
      if (results) {
        toast.success("General info updated", { id: "update-general-info" });
        invalidate(`lead-general-info-${results}`);
      }
      if (cb) cb();
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-general-info" }),
  });

  const onUpdateLeadGeneralInfo = useCallback(
    (values: LeadGeneralSchemaType) => {
      toast.loading("Updating general info...", { id: "update-general-info" });
      updateLeadGeneralInfoMutate(values);
    },
    [updateLeadGeneralInfoMutate]
  );

  return {
    onLeadUpdateQuote,
    leadQuoteUpdating,
    onUpdateLeadMainInfo,
    mainInfoUpdating,
    onUpdateLeadGeneralInfo,
    generalInfoUpdating,
  };
};

//TODO this need to be extracted and removed
export const useLeadNotesActions = (leadId:string) => {
  const { invalidate } = useInvalidate();
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState<string | null>("");

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
      invalidate(`lead-notes-${leadId}`);
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

export const useLeadCallInfoActions = (leadId:string) => {
  const {invalidate} = useInvalidate();
  const { socket } = useSocketStore()

  //CALL INFO
  const onGetLeadCallInfo=()=>{
    const { data: callInfo, isFetching: callInfoFetching,isLoading:callInfoLoading } =
    useQuery<LeadCallInfoSchemaTypeP | null>({
      queryFn: () => getLeadCallInfo(leadId as string),
      queryKey: [`lead-call-info-${leadId}`],
      enabled: !!leadId,
    });
    return{
      callInfo,
      callInfoFetching,
      callInfoLoading
    }
  }

  useEffect(() => {
    socket?.on("calllog:new", (data: { dt: Call }) => {
      if (data.dt.leadId == leadId) invalidate(`lead-call-info-${leadId}`);
    });
    return () => {      
      socket?.off("calllog:new");
    };
  }, []);

  return {
    onGetLeadCallInfo
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
