export type TwilioNumber={
    friendlyName: string,
      phoneNumber: string,
      lata: string,
      locality: string,
      rateCenter: string,
      latitude: string,
      longitude: string,
      region: string,
      postalCode:string,
      isoCountry: string,
      addressRequirements: string,
      beta: boolean,
      capabilities: { voice: boolean, SMS: boolean, MMS: boolean }
      onPurchase?:(e:string)=>void
  }

  export type TwilioCall={
    callSid:string
    direction:string;  
    to:string;
    from:string;
    callerName:string
    callStatus:string;
    agentNumber:string
    agentId:string;
    coach:string
    caller:string;
    recording:boolean
    currentCall?:string|null;
    voicemailIn?:string|null;
  }

  export type TwilioCallResult={
    accountSid:string;
    apiVersion:string;
    applicationSid:string;
    callbackSource:string;
    callDuration:string;
    called:string;
    calledCity:string;
    calledCountry:string;
    calledState:string;
    calledZip:string;
    caller:string;
    callerCity:string;
    callerCountry:string;
    callerState:string;
    callerZip:string;
    callSid	:string;
    callStatus:string;
    direction:string;
    duration:string;
    from:string;
    fromCity:string;
    fromCountry:string;
    fromState:string;
    fromZip:string;
    sequenceNumber:string;
    timestamp:string;
    to:string;
    toCity:string;
    toCountry:string;
    toState	:string;
    toZip:string;
  }

  export type TwilioSms={
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
  }




 
  
 