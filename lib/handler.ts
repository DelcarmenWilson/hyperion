import { nameGenerator } from "@/formulas/name-generator";
import { cfg } from "./twilio-config";
import twilio from "twilio";
import { useCurrentUser } from "@/hooks/use-current-user";
import { db } from "./db";
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

let identity: string;

export function tokenGenerator(id?: string) {
  if (id) {
    identity = id;
  } else {
    identity = nameGenerator();
  }
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

export async function voiceResponse (requestBody: any) {

  const toNumberOrClientName = requestBody.To;
  let callerId = requestBody.AgentNumber;

  const existingNumbers = await db.phoneNumber.findMany({where:{phone:requestBody.To}})
  if (existingNumbers.length) {
    callerId == existingNumbers[0].phone
  }

  console.log(toNumberOrClientName,existingNumbers,callerId,requestBody)
  let twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    let dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client
    dial.client(identity);
  } else if (requestBody.To) {
    // This is an outgoing call

    // set the callerId
    let dial = twiml.dial({ callerId });

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }

  return twiml.toString();
}

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number: string) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
