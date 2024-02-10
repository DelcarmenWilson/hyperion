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
  
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
};

export const voiceResponse = async (requestBody: any) => {
  const { agentId, agentNumber, direction, recording,to } = requestBody;

  const params = {
    callerId: agentNumber,
    record: recording,
    recordingStatusCallback: "/api/voice/recording",
  };

  const twiml = new VoiceResponse();

  let dial = twiml.dial(params);

  switch (direction) {
    case "inbound":
      // twiml.say({voice:"alice"},"Thank you for calling strongside financial, please hold")
      // twiml.pause({length:1})
      // twiml.say({voice:"alice"},"For english press 1")
      // twiml.pause({length:1})
      // twiml.say({voice:"alice"},"Para español oprima 2")
      // twiml.gather({})
      dial.client(agentId);
      break;
    case "outbound":
      const attr = isAValidPhoneNumber(to)
        ? "number"
        : "client";
      dial[attr](to);
      break;
    default:
      twiml.say("Thanks for calling!");
      break;
  }

  return twiml.toString();
};
