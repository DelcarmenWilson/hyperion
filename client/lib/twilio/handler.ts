import { cfg } from "./config";
import twilio from "twilio";

import { isAValidPhoneNumber } from "@/formulas/phones";
import { TwilioCall } from "@/types";

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

export const voiceResponse = async (call: TwilioCall) => {
  const {
    agentId,
    agentName,
    agentNumber,
    direction,
    coach,
    from,
    to,
    callerName,
    conferenceId,
    callSidToCoach,
    voicemailIn,
  } = call;

  const twiml = new VoiceResponse();
  switch (direction) {
    case "inbound":
      twiml.play("/sounds/SSF-Greeting-2.mp3")
    //   twiml.say(
    //   { voice:"Polly.Amy" },
    //   "Thankyou for calling Strong Side Financial. Your call may be monitored and or recorded. By continuing you consent to the companys monitoring and recording of your call."
    // );
    
    twiml.pause({length:1});
        
    const inDial = twiml.dial({
      record: "record-from-answer-dual",
      recordingStatusCallback: "/api/twilio/voice/recording",
      action: "/api/twilio/voice/action",
      timeout: 10,
    });
      inDial.client(agentId);
      break;
    case "outbound":
      twiml.dial().conference({
          participantLabel: agentId,
          startConferenceOnEnter: true,
          endConferenceOnExit: true,
          beep: "false",
          waitUrl: "",
          record: "record-from-start",
          recordingStatusCallback: "/api/twilio/voice/conference/recording",
        },
        agentId
      );
      break;
    case "coach":
      const dialCoach = twiml.dial();
      dialCoach.conference(
        {
          beep: "false",
          participantLabel: agentId,
          coach: callSidToCoach,
          // action: "/api/twilio/voice/action",
          // timeout: 10,
        },
        conferenceId as string
      );
      console.log(
        "dialCoach:",
        dialCoach,
        "callSidToCoach:",
        callSidToCoach,
        "conferenceId:",
        conferenceId,
        "agentId:",
        agentId
      );
      break;
    default:
      twiml.say({ voice: "alice" }, "Thanks for calling!");
      break;
  }
  return twiml.toString();
};

export const actionResponse = async () => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: "/api/twilio/voice/callback",
    numDigits: 1,
  });

  gather.say(
    { voice: "alice" },
    "The person you are trying to reach is unavailable. If you would like to receive a callback, press 1."
  );
  twiml.pause({ length: 1 });
  const gather2 = twiml.gather({
    action: "/api/twilio/voice/callback",
    numDigits: 1,
  });
  gather2.say(
    { voice: "alice" },
    "If you would like to leave a voicemail instead press 2."
  );
  twiml.pause({ length: 1 });
  const gather3 = twiml.gather({
    action: "/api/twilio/voice/callback",
    numDigits: 1,
  });
  gather3
    .say({ voice: "alice" }, "Otherwise press 3 or hangup.")
    .twiml.pause({ length: 1 });
  twiml.redirect("/api/twilio/voice/callback");

  return twiml.toString();
};

export const voicemailResponse = async (requestBody: any) => {
  const { voicemailIn } = requestBody;

  const twiml = new VoiceResponse();
  twiml.pause({ length: 1 });
  if (voicemailIn) {
    twiml.play(voicemailIn);
    //twiml.play({},'/sounds/message.mp3');
  } else {
    twiml.say(
      { voice: "alice" },
      "The person you are trying to reach is unavailable. Please leave a voicemail after the beep."
    );
  }

  twiml.pause({ length: 1 });
  twiml.record({
    action: "/api/twilio/voice/voicemail",
    timeout: 5,
    transcribe: true,
    transcribeCallback: "/api/twilio/voice/transcribe",
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
