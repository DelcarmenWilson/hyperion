import { cfg } from "./config";
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
  const { agentId, agentNumber, direction, recording, to, voicemailIn } =
    requestBody;

  const twiml = new VoiceResponse();
  const params = {
    callerId: agentNumber,
    record: recording,
    recordingStatusCallback: "/api/twilio/voice/recording",
    // action: "/api/twilio/voice/action",
    // timeout:10
  };
  switch (direction) {
    case "inbound":
      const inDial = twiml.dial({
        ...params,
        action: "/api/twilio/voice/action",
        timeout: 10,
      });
      inDial.client(agentId);
      break;
    case "outbound":
      const attr = isAValidPhoneNumber(to) ? "number" : "client";
      const outDial = twiml.dial(params);
      outDial[attr](to);
      break;
    default:
      twiml.say({ voice: "alice" }, "Thanks for calling!");
      break;
  }
  return twiml.toString();
};

export const actionResponse = async () => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({ action: "/api/twilio/voice/callback", numDigits: 1 });

  gather.say(
    { voice: "alice" },
    "The person you are trying to reach is unavailable. If you would like to receive a callback, press 1."
  );
  twiml.pause("1");
  const gather2 = twiml.gather({ action: "/api/twilio/voice/callback", numDigits: 1 });
  gather2.say(
    { voice: "alice" },
    "If you would like to leave a voicemail instead press 2."
  );
  twiml.pause("1");
  const gather3 = twiml.gather({ action: "/api/twilio/voice/callback", numDigits: 1 });
  gather3
    .say({ voice: "alice" }, "Otherwise press 3 or hangup.")
    .twiml.pause("1");
  twiml.redirect("/api/twilio/voice/callback");

  return twiml.toString();
};

export const voicemailResponse = async (requestBody: any) => {
  const { voicemailIn } = requestBody;

  const twiml = new VoiceResponse();
  twiml.pause("1");
  if (voicemailIn) {
    twiml.play(voicemailIn);
    //twiml.play({},'/sounds/message.mp3');
  } else {
    console.log(voicemailIn);
    twiml.say(
      { voice: "alice" },
      "The person you are trying to reach is unavailable. Please leave a voicemail after the beep."
    );
  }

  twiml.pause("1");
  twiml.record({
    action: "twilio//voicemail",
    timeout: 5,
    // transcribe: true,
    // transcribeCallback: "/api/twilio/voice/transcribe",
  });
  twiml.say({ voice: "alice" }, "Your mesage has been saved. Goodbye.");
  twiml.hangup();
  return twiml.toString();
};

export const hangupReponse = async () => {
  const twiml = new VoiceResponse();
  twiml.hangup();
  return twiml.toString();
};
