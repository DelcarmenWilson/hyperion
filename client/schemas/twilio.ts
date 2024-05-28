import * as z from "zod";
export const TwilioSchema = z.object({
    phone: z.string(),
    message: z.string(),
  });
  export type TwilioSchemaType = z.infer<typeof TwilioSchema>;
  