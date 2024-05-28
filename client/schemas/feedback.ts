import { z } from "zod";

export const FeedbackSchema = z.object({
    id: z.optional(z.string()),
    userId: z.optional(z.string()),
    headLine: z.string().min(3),
    page: z.string(),
    feedback: z.string().min(5),
    images: z.optional(z.string()),
  });
  export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;
  
  export const DevFeedbackSchema = z.object({
    id: z.optional(z.string()),
    status: z.string(),
    comments: z.optional(z.string()),
  });
 export type DevFeedbackSchemaType = z.infer<typeof DevFeedbackSchema>;