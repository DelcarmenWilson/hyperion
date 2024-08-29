import * as z from "zod";

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  objective: z.string(),
  status: z.string(),
  startDate: z.date(),
  endDate: z.optional(z.date()),
  targetId:z.string()
});
export type CampaignSchemaType = z.infer<typeof CampaignSchema>;


export const CampaignAdSetSchema = z.object({
    id: z.string(),
    campaignId: z.string(),
    name: z.string(),
    dailyBudget:z.number(),
    objective: z.string(),
    status: z.string(),
    startDate: z.date(),
    endDate: z.optional(z.date()),
  });
  export type CampaignAdSetSchemaType = z.infer<typeof CampaignAdSetSchema>;


  export const CampaignAdSchema = z.object({
    id: z.string(),
    adSetId: z.string(),
    name: z.string(),
    image:z.string(),
    formId: z.string(),
    status: z.string(),
    startDate: z.date(),
    endDate: z.optional(z.date()),
  });
  export type CampaignAdSchemaType = z.infer<typeof CampaignAdSchema>;


  export const CampaignFormSchema = z.object({
    id: z.optional(z.string()),
    name: z.string(),
    headline:z.string(),
    body: z.string(),
  });
  export type CampaignFormSchemaType = z.infer<typeof CampaignFormSchema>;

  export const CampaignTargetAudienceSchema = z.object({
    id: z.optional(z.string()),
    name: z.string(),
    age:z.string(),
    states: z.string(),
  });
  export type CampaignTargetAudienceSchemaType = z.infer<typeof CampaignTargetAudienceSchema>;