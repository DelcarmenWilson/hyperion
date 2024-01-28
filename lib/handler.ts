import { cfg } from "./twilio-config";
import twilio from "twilio";
import { db } from "./db";
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
  let callerId = requestBody.AgentNumber;

  const existingNumbers = await db.phoneNumber.findMany({where:{phone:requestBody.To}})
  const myphone=existingNumbers[0]
  if (myphone) {
    callerId = myphone.phone
  }

  // console.log(identity,toNumberOrClientName,existingNumbers,callerId,requestBody)
  let twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    
    let dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client
    dial.client(myphone.agentId as string);
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


