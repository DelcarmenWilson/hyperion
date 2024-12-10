
import { create } from "zustand";

import { User } from "@prisma/client";
import {
  LeadPolicySchemaType,
} from "@/schemas/lead";

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