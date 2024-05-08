import { cfg } from "./config";
import twilio from "twilio";

import { isAValidPhoneNumber } from "@/formulas/phones";
import { TwilioCall } from "@/types/twilio";

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
    agentNumber,
    direction,
    coach,
    recording,
    from,
    to,
    callerName,
    voicemailIn,
  } = call;

  console.log(call)

  const twiml = new VoiceResponse();
  // const params = {
  //   callerId: agentNumber,
  // };

  // ? "record-from-answer-dual"
  // : "do-not-record";
  switch (direction) {
    case "inbound":
      // twiml.say(
      //   { voice: "man" },
      //   "Thankyou for calling Strongside. Your call may be monitored and or recorded. By continuing you consent to the companys monitoring and recording of your call."
      // );
      // twiml.pause("1");
      // twiml.say({ voice: "man" }, "You are now being connected with Wilson.");
      // const dialIn = twiml.dial({
      //   record: recording ? "record-from-answer-dual" : "do-not-record",
      //   recordingStatusCallback: "/api/twilio/voice/recording",
      // });
      // dialIn.conference(
      //   {
      //     beep: "false",
      //     startConferenceOnEnter: false,
      //     waitUrl:
      //       "http://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars",
      //     participantLabel: callerName || from,
      //     // muted:true
      //     // action: "/api/twilio/voice/action",
      //     // timeout: 10,
      //   },
      //   agentId
      // );
      case "inbound":
      const inDial = twiml.dial({        
        record: recording ? "record-from-answer-dual" : "do-not-record",
        recordingStatusCallback: "/api/twilio/voice/recording",
        action: "/api/twilio/voice/action",
        timeout: 10,
      });
      inDial.client(agentId);
      break;
    case "outbound":
      const attr = isAValidPhoneNumber(to) ? "number" : "client";
      const dialOut = twiml.dial({
        callerId: agentNumber,
        record: recording ? "record-from-answer-dual" : "do-not-record",
        recordingStatusCallback: "/api/twilio/voice/recording",
      });
      dialOut[attr](to);
      if (coach=="on"){
        dialOut.conference(
          {
            participantLabel: callerName || from,
            startConferenceOnEnter: true,
            endConferenceOnExit: true,
            beep: "false",
            waitUrl: "",
          },
          agentId
        );}
      break;
    case "conference":
      const dialCOnference = twiml.dial();
      dialCOnference.conference(
        {
          beep: "true",
          record: recording ? "record-from-start" : "do-not-record",
          recordingStatusCallback: "/api/twilio/voice/recording",
          startConferenceOnEnter: true,
          endConferenceOnExit: true,
          participantLabel: callerName || from,
          // action: "/api/twilio/voice/action",
          // timeout: 10,
        },
        agentId
      );
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
  twiml.pause("1");
  const gather2 = twiml.gather({
    action: "/api/twilio/voice/callback",
    numDigits: 1,
  });
  gather2.say(
    { voice: "alice" },
    "If you would like to leave a voicemail instead press 2."
  );
  twiml.pause("1");
  const gather3 = twiml.gather({
    action: "/api/twilio/voice/callback",
    numDigits: 1,
  });
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
    twiml.say(
      { voice: "alice" },
      "The person you are trying to reach is unavailable. Please leave a voicemail after the beep."
    );
  }

  twiml.pause("1");
  twiml.record({
    action: "/api/twilio/voice/voicemail",
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
