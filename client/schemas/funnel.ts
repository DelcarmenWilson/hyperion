import { z } from 'zod'
export const CreateFunnelFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional(),
  })

  export type CreateFunnelFormSchemaType = z.infer<typeof CreateFunnelFormSchema>;

  export const FunnelPageSchema = z.object({
    name: z.string().min(1),
    pathName: z.string().optional(),
  })

  export type FunnelPageSchemaType = z.infer<typeof FunnelPageSchema>;