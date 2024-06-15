import { PhoneNumber } from "@prisma/client";

export type FullPhoneNumber = PhoneNumber & {
  agent: { firstName: string; lastName: string } | null;
};

export type PhoneType = {
  value: string;
  state: string;
};
