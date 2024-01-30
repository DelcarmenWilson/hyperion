import { cfg } from "./twilio-config";
import twilio from "twilio";

import { isAValidPhoneNumber } from "@/formulas/phones";
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export const tokenGenerator=(identity: string)=> {
  const accessToken = new AccessToken(
    cfg.accountSid,
    cfg.apiKey,
    cfg.apiSecret,
    { identity }
  );

  const grant = new VoiceGrant({
    outgoingApplicationSid: cfg.twimlAppSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
}

export  const voiceResponse=async (requestBody: any) =>{

  const toNumberOrClientName = requestBody.To;
  const {AgentId,AgentNumber}=requestBody
  
  let twiml = new VoiceResponse();
  
  if (toNumberOrClientName == AgentNumber) {
    
    let dial = twiml.dial({record:"record-from-answer-dual",recordingStatusCallback:"/api/voice/recording" });
    
    dial.client(AgentId);
  } else if (requestBody.To) {
    // This is an outgoing call    

    // set the callerId
    let dial = twiml.dial({callerId:AgentNumber,record:"record-from-answer-dual",recordingStatusCallback:"/api/voice/recording" });    
    
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
   } 
   //else {
  //   twiml.say("Thanks for calling!");
  // }

  return twiml.toString();
}