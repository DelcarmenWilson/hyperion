import { z } from "zod";

export const JobSchema = z.object({
  id: z.optional(z.string()),
  headLine: z.string().min(3),
  description: z.string().min(3),
  category: z.string().min(3),
  comments: z.string(),
});
export type JobSchemaType = z.infer<typeof JobSchema>;

export const MiniJobSchema = z.object({
  id: z.optional(z.string()),
  jobId: z.optional(z.string()),
  name: z.string().min(3),
  description: z.string().min(3),
  comments: z.string(),
});
export type MiniJobSchemaType = z.infer<typeof MiniJobSchema>;
