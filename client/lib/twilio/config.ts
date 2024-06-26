import dotenv from "dotenv";
import twilio from "twilio";

if (process.env.NODE_ENV !== "test") {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: ".env.example" });
}

type config = {
  port: number | string;
  accountSid: string;
  twimlAppSid: string;
  messageServiceSid:string
  callerId: string;
  apiKey: string;
  apiSecret: string;
  apiToken: string;
};
export const vResponse = twilio.twiml.VoiceResponse;

export const cfg: config = {
  port: process.env.PORT || 3000,
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  twimlAppSid: process.env.TWILIO_TWIML_APP_SID!,
  messageServiceSid:process.env.TWILIO_MESSAGE_SERVIVE_SID!,
  callerId: process.env.TWILIO_CALLER_ID!,
  apiKey: process.env.TWILIO_API_KEY!,
  apiSecret: process.env.TWILIO_API_SECRET!,
  apiToken: process.env.TWILIO_API_TOKEN!,
};

export const client = twilio(cfg.accountSid, cfg.apiToken);
