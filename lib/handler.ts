import { cfg } from "./twilio-config";
import twilio from "twilio";

import { isAValidPhoneNumber } from "@/formulas/phones";

const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const sitebase = "https://insect-pro-luckily.ngrok-free.app/public";

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

  const params = {
    callerId: agentNumber,
    record: recording,
    recordingStatusCallback: "/api/voice/recording",
    action: "/api/voice/action",
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
      const attr = isAValidPhoneNumber(to) ? "number" : "client";
      dial[attr](to);
      break;
    default:
      twiml.say({ voice: "alice" }, "Thanks for calling!");
      break;
  }

  return twiml.toString();
};

export const actionResponse = async () => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({ action: "/api/voice/callback", numDigits: 1 });

  gather.say(
    { voice: "alice" },
    "The person you are trying to reach is unavailable. If you would like to receive a callback, press 1."
  );
  twiml.pause("1");
  const gather2 = twiml.gather({ action: "/api/voice/callback", numDigits: 1 });
  gather2.say(
    { voice: "alice" },
    "If you would like to leave a voicemail instead press 2."
  );
  twiml.pause("1");
  const gather3 = twiml.gather({ action: "/api/voice/callback", numDigits: 1 });
  gather3
    .say({ voice: "alice" }, "Otherwise press 3 or hangup.")
    .twiml.pause("1");
  twiml.redirect("/api/voice/callback");

  return twiml.toString();
};

export const voicemailResponse = async (requestBody: any) => {
  const { voicemailIn } = requestBody;

  const twiml = new VoiceResponse();
  twiml.pause("1");
  if (voicemailIn) {
    twiml.play(voicemailIn);
  } else {
    twiml.say(
      { voice: "alice" },
      "The person you are trying to reach is unavailable. Please leave a voicemail after the beep"
    );
  }

  twiml.pause("1");
  twiml.record({
    action: "/api/voice/voicemail",
    timeout: 5,
    // transcribe: true,
    // transcribeCallback: "/api/voice/transcribe",
  });
  twiml.say({ voice: "alice" }, "Your mesage has been saved. Goodbye.");
  twiml.hangup();
  return twiml.toString();
};
