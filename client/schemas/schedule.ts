import * as z from "zod";

  export const ScheduleDaySchema = z.object({
    day: z.string().min(1),
    workFrom: z.optional(z.string()),
    workTo: z.optional(z.string()),
    breakFrom1: z.optional(z.string()),
    breakTo1: z.optional(z.string()),
    breakFrom2: z.optional(z.string()),
    breakTo2: z.optional(z.string()),
  });