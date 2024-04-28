import {
  FullLeadMedicalCondition,
  LeadGeneralInfo,
  LeadMainInfo,
  LeadPolicyInfo,
} from "@/types";
import { LeadBeneficiary, Message } from "@prisma/client";

type EventMap = {
  beneficiaryInserted: [info: LeadBeneficiary];
  beneficiaryUpdated: [info: LeadBeneficiary];
  beneficiaryDeleted: [id: string];
  conditionInserted: [info: FullLeadMedicalCondition];
  conditionUpdated: [info: FullLeadMedicalCondition];
  conditionDeleted: [id: string];  
  expenseUpdated: [type: string,total:number];
  generalInfoUpdated: [info: LeadGeneralInfo];
  leadStatusChanged: [leadId: string, newStatus: string];
  mainInfoUpdated: [info: LeadMainInfo];
  messageInserted: [info: Message];
  policyInfoUpdated: [info: LeadPolicyInfo];
  //TOGGLE EVENTS
  toggleLeadInfo:[open:boolean]
//NEW EVENTS
  newCall: [leadId: string];
  newNote: [leadId: string, note: string];

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
  var emitter: EventEmmitter<EventMap> | undefined;
}
export const emitter = globalThis.emitter || new EventEmmitter<EventMap>();
