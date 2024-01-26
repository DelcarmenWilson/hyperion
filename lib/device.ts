import { Device } from "twilio-client";

declare global {
  var device: Device | undefined;
}
export const device = globalThis.device || new Device();

if (process.env.NODE_ENV !== "production") globalThis.device = device;
