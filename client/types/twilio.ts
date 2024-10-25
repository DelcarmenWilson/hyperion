export type TwilioNumber = {
  friendlyName: string;
  phoneNumber: string;
  lata: string;
  locality: string;
  rateCenter: string;
  latitude: string;
  longitude: string;
  region: string;
  postalCode: string;
  isoCountry: string;
  addressRequirements: string;
  beta: boolean;
  capabilities: { voice: boolean; SMS: boolean; MMS: boolean };
  onPurchase?: (e: string) => void;
};

export type TwilioCall = {
  callSid: string;
  direction: string;
  callDirection:string;
  to: string;
  from: string;
  callerName: string;
  callStatus: string;
  callerState:string;

  agentNumber: string;
  agentId: string;
  agentName:string;

  coach: string;
  caller: string;
  currentCall?: string | null;
  conferenceId?:string;
  callSidToCoach?:string;
  voicemailIn?: string | null;
  voicemailOut?: string | null;

  masterSwitch?:string
  personalNumber?:string
};

export type TwilioCallResult = {
  accountSid: string;
  apiVersion: string;
  applicationSid: string;
  callbackSource: string;
  callDuration: string;
  called: string;
  calledCity: string;
  calledCountry: string;
  calledState: string;
  calledZip: string;
  caller: string;
  callerCity: string;
  callerCountry: string;
  callerState: string;
  callerZip: string;
  callSid: string;
  callStatus: string;
  direction: string;
  duration: string;
  from: string;
  fromCity: string;
  fromCountry: string;
  fromState: string;
  fromZip: string;
  sequenceNumber: string;
  timestamp: string;
  to: string;
  toCity: string;
  toCountry: string;
  toState: string;
  toZip: string;
};
export type TwilioAmdResult = {
  accountSid: string;
  callSid: string;
  answeredBy: string;
  machineDetectionDuration: string;
};


export type TwilioSms = {
  toCountry: string;
  toState: string;
  smsMessageSid: string;
  numMedia: string;
  toCity: string;
  fromZip: string;
  smsSid: string;
  fromState: string;
  smsStatus: string;
  fromCity: string;
  body: string;
  fromCountry: string;
  to: string;
  messagingServiceSid: string;
  toZip: string;
  numSegments: string;
  messageSid: string;
  accountSid: string;
  from: string;
  apiVersion: string;
};

export type TwilioConference = {
  accountSid: string;
  dateCreated: string;
  dateUpdated: string;
  apiVersion: string;
  friendlyName: string;
  region: string;
  sid: string;
  status: string;
  uri: string;
  subresourceUris: {
    participants: string;
    recordings: string;
  };
  reasonConferenceEnded: string;
  callSidEndingConference: string;
};

export type TwilioShortConference = {
  agentId:string
  agentName:string
  conferenceSid: string;
  callSidToCoach: string | null;
  coaching: boolean;
  leadId:string,
  leadName:string,
  coachId?:string,
  coachName?:string,
};

export type TwilioShortParticipant = {  
  conferenceSid: string;
  from: string ;
  to: string;
  label: string ;
  callSidToCoach: string | null;
  coaching: boolean;
  record: boolean;
  earlyMedia: boolean;
  endConferenceOnExit: boolean;
  startConferenceOnEnter: boolean;
};
export type TwilioParticipant = {
  accountSid: string;
  callSid: string;
  label: string | null;
  callSidToCoach: string | null;
  coaching: boolean;
  conferenceSid: string;
  dateCreated: string;
  dateUpdated: string;
  endConferenceOnExit: boolean;
  startConferenceOnEnter: boolean;
  muted: boolean;
  hold: boolean;
  status: string;
  uri: string;
};

export type TwilioRecording = {
  accountSid: string;
  apiVersion: string;
  callSid: string;
  conferenceSid: string;
  dateCreated: string;
  dateUpdated: string;
  startTime: string;
  duration: string;
  sid: string;
  price: string;
  priceUnit: string;
  status: string;
  channels: 1,
  source: string;
  errorCode: null,
  uri: string;
  encryptionDetails: null,
  subresourceUris: {
    add_on_results: string;
    transcriptions: string;
  },
  mediaUrl:string;
}
export type TwilioConferenceRecording = {
  recordingSource: string;
  recordingSid: string;
  conferenceSid: string;
  recordingUrl: string;
  recordingStatus: string;
  recordingChannels: string;
  errorCode: string;
  recordingStartTime: string;
  accountSid: string;
  recordingDuration: string;
};