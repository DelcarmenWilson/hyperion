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
    voicemailIn?:string|null;
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




 
  
 