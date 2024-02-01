import { cfg } from "./twilio-config";
import twilio from "twilio";

import { isAValidPhoneNumber } from "@/formulas/phones";
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export const tokenGenerator = (identity: string) => {
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
};

export const voiceResponse = async (requestBody: any) => {
  const toNumberOrClientName = requestBody.To;
  const { CallSid, AgentId, AgentNumber, Direction, Recording } = requestBody;
    
  const params = {
    callerId: AgentNumber,
    record: Recording,
    recordingStatusCallback: "/api/voice/recording"
  };

  let twiml = new VoiceResponse();

  if (Direction == "inbound") {
    // This is an incoming call
    let dial = twiml.dial(params);
    dial.client(AgentId);
  } else if (requestBody.To) {
    // This is an outgoing call

    let dial = twiml.dial(params);

    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr](toNumberOrClientName);

    // dial.conference({coach:CallSid,},AgentId)
  }
  else {
    twiml.say("Thanks for calling!");
  }

  return twiml.toString();
};
