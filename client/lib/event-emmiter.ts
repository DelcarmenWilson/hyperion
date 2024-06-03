import {
  FullChatMessage,
  FullLeadMedicalCondition,
  FullTeam,
  FullCarrierCondition,
  FullUserCarrier,
  LeadGeneralInfo,
  LeadMainInfo,
  LeadPolicyInfo,
} from "@/types";

import {
  Appointment,
  Feedback,
  HyperionLead,
  LeadBeneficiary,
  LeadExpense,
  LeadStatus,
  Message,
  Presets,
  UserLicense,
  UserTemplate,
} from "@prisma/client";

type UserEvents = {
  appointmentScheduled: [info: Appointment];
  beneficiaryDeleted: [id: string];
  beneficiaryInserted: [info: LeadBeneficiary];
  beneficiaryUpdated: [info: LeadBeneficiary];

  //CARRIER CONDITIONS
  carrierConditionDeleted: [id: string];
  carrierConditionInserted: [info: FullCarrierCondition];
  carrierConditionUpdated: [info: FullCarrierCondition];

  //CARRIERS
  carrierDeleted: [id: string];
  carrierInserted: [info: FullUserCarrier];
  carrierUpdated: [info: FullUserCarrier];
  conditionDeleted: [id: string];
  conditionInserted: [info: FullLeadMedicalCondition];
  conditionUpdated: [info: FullLeadMedicalCondition];

  conversationSeen: [conversationId: string];

  expenseDeleted: [id: string];
  expenseInserted: [info: LeadExpense];
  expenseUpdated: [info: LeadExpense];

  feedbackInserted: [info: Feedback];
  feedbackUpdated: [info: Feedback];

  generalInfoUpdated: [info: LeadGeneralInfo];
  leadStatusChanged: [leadId: string, newStatus: string];
  licenseDeleted: [id: string];
  licenseInserted: [info: UserLicense];
  licenseUpdated: [info: UserLicense];
  mainInfoUpdated: [info: LeadMainInfo];
  chatMessageInserted: [info: FullChatMessage];
  messageInserted: [info: Message];

  presetInserted: [Presets];
  policyInfoUpdated: [info: LeadPolicyInfo];
  //TEMPLATES
  templateDeleted: [id: string];
  templateInserted: [info: UserTemplate];
  templateUpdated: [info: UserTemplate];
  templateSelected: [info: UserTemplate];

  //CONFERENCE AND PARTICIPANTS
  participantsFetch: [conferenceId: string];
  joinCall: [callSid: string];

  userLeadStatusDeleted: [id: string];
  userLeadStatusInserted: [info: LeadStatus];
  userLeadStatusUpdated: [info: LeadStatus];
  //TOGGLE EVENTS
  toggleLeadInfo: [open: boolean];
  //NEW EVENTS
  newCall: [leadId: string];
  newNote: [leadId: string, note: string];
};

type AdminEvents = {
  hyperionLeadDeleted: [id: string];
  hyperionLeadInserted: [info: HyperionLead];
  hyperionLeadUpdated: [info: HyperionLead];
  teamDeleted: [id: string];
  teamInserted: [info: FullTeam];
  teamUpdated: [info: FullTeam];
  tempImageDeleted: [id: string];
};

type Listener<T extends Array<any>> = (...args: T) => void;
class EventEmmitter<EventMap extends Record<string, Array<any>>> {
  private eventListeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>;
  } = {};

  on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const listeners = this.eventListeners[eventName] ?? new Set();

    listeners.add(listener);
    this.eventListeners[eventName] = listeners;
  }
  off<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const listeners = this.eventListeners[eventName];
    if (!listeners) return;

    listeners.delete(listener);
  }
  emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const listeners = this.eventListeners[eventName];
    if (!listeners) return;
    for (const listener of listeners) {
      listener(...args);
    }
  }
}

declare global {
  var userEmitter: EventEmmitter<UserEvents> | undefined;
  var adminEmitter: EventEmmitter<AdminEvents> | undefined;
}

export const userEmitter =
  globalThis.userEmitter || new EventEmmitter<UserEvents>();
export const adminEmitter =
  globalThis.adminEmitter || new EventEmmitter<AdminEvents>();
