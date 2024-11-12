import { z } from "zod";

export const CreateFeedbackSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    page: z.string(),
    images: z.optional(z.string()),
  });
  export type CreateFeedbackSchemaType = z.infer<typeof CreateFeedbackSchema>;

  export const UpdateFeedbackSchema = z.object({
    id: z.string(),
    title: z.string().min(3),
    description: z.string().min(5),
    page: z.string(),
    images: z.optional(z.string()),
  });
  export type UpdateFeedbackSchemaType = z.infer<typeof UpdateFeedbackSchema>;
  
  export const UpdateDevFeedbackSchema = z.object({
    id: z.string(),
    status: z.string(),
    comments: z.string().optional(),
  });
 export type UpdateDevFeedbackSchemaType = z.infer<typeof UpdateDevFeedbackSchema>;