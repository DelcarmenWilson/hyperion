import { PhoneNumber } from "@prisma/client";

export type FullPhoneNumber = PhoneNumber & {
  agent: { firstName: string; lastName: string } | null;
};

export type PhoneType = {
  value: string;
  state: string;
};
export type Voicemail = {
  id: string;
  lead: { firstName: string; lastName: string } | null;
  from: string;
  recordUrl: string | null;
  updatedAt: Date;
};
