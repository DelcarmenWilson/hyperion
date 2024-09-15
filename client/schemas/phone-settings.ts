import * as z from "zod";
import { isAValidPhoneNumber } from "@/formulas/phones";

export const PhoneSettingsSchema = z.object({
  userId: z.string(),
  personalNumber: z.string().refine(
    (val) => {
      if (val.length >= 1) {
        return isAValidPhoneNumber(val)
      }
      return true;
    },
    (val) => ({ message: `${val} Please enter a valid phone number ` })
  ),
incoming: z.string(),
outgoing: z.string(),
dtmfPack: z.string(),

messageNotification: z.string(),
messageInternalNotification: z.string(),

});
export type PhoneSettingsSchemaType = z.infer<typeof PhoneSettingsSchema>;
