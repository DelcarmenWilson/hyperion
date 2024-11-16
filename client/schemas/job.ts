import { z } from "zod";

export const CreateJobSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});
export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().optional(),
  comments:z.string().optional(),
});
export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;

export const CreateMiniJobSchema = z.object({
  jobId: z.string(),
  name: z.string().min(3),
  category: z.string().min(3),
  description: z.string().optional(),
  comments: z.string().optional(),
});
export type CreateMiniJobSchemaType = z.infer<typeof CreateMiniJobSchema>;

export const UpdateMiniJobSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  name: z.string().min(3),
  description: z.string().optional(),
  comments: z.string().optional(),
});
export type UpdateMiniJobSchemaType = z.infer<typeof UpdateMiniJobSchema>;
