import * as z from "zod";

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  account_id: z.string(),
  bid_strategy: z.optional(z.string()),
  buying_type: z.string(),
  daily_budget: z.optional(z.string()),
  objective: z.string(),
  smart_promotion_type: z.string(),
  source_campaign_id: z.string(),
  start_time: z.optional(z.date()),
  status: z.string(),
  user_id: z.string(),
  created_at: z.optional(z.date()),
  updated_at: z.optional(z.date()),
});
export type CampaignSchemaType = z.infer<typeof CampaignSchema>;

export const CampaignAdsetSchema = z.object({
  id: z.string(),
  campaign_id: z.string(),
  name: z.string(),
  billing_event: z.optional(z.string()),
  optimization_goal: z.optional(z.string()),
  optimization_sub_event: z.optional(z.string()),

  start_time: z.optional(z.date()),
  status: z.string(),
  target_id: z.optional(z.string()),
  created_at: z.optional(z.date()),
  updated_at: z.optional(z.date()),
});
export type CampaignAdsetSchemaType = z.infer<typeof CampaignAdsetSchema>;

export const CampaignAdSchema = z.object({
  id: z.string(),
  adset_id: z.string(),
  name: z.string(),
  bid_type: z.string(),
  demolink_hash: z.string(),
  preview_shareable_link: z.string(),
  creative_id: z.optional(z.string()),
  status: z.string(),
  created_at: z.optional(z.date()),
  updated_at: z.optional(z.date()),
});
export type CampaignAdSchemaType = z.infer<typeof CampaignAdSchema>;

export const CampaignCreativeSchema = z.object({
  id: z.optional(z.string()),
  account_id: z.string(),
  name: z.string(),
  title: z.optional(z.string()),
  body: z.optional(z.string()),
  call_to_action_type: z.optional(z.string()),
  image_hash: z.optional(z.string()),
  image_url: z.optional(z.string()),
  object_type: z.string(),
  thumbnail_url: z.string(),
  video_id: z.optional(z.string()),
  status: z.string(),
  user_id: z.string(),
});
export type CampaignCreativeSchemaType = z.infer<typeof CampaignCreativeSchema>;

export const CampaignAudienceSchema = z.object({
  id: z.optional(z.string()),
  account_id: z.string(),
  name: z.string(),
  run_status: z.string(),
  user_id: z.string(),
  created_at: z.optional(z.date()),
  updated_at: z.optional(z.date()),
});
export type CampaignAudienceSchemaType = z.infer<typeof CampaignAudienceSchema>;

export const CampaignFormSchema = z.object({
  id: z.optional(z.string()),
  name: z.string(),

  allow_organic_lead: z.boolean(),
  block_display_for_non_targeted_viewer: z.boolean(),
  expired_leads_count: z.number(),
  follow_up_action_url: z.string(),
  leads_count: z.number(),
  privacy_policy_url: z.string(),
  question_page_custom_headline: z.string(),

  status: z.string(),
  user_id: z.string(),
  created_at: z.optional(z.date()),
});
export type CampaignFormSchemaType = z.infer<typeof CampaignFormSchema>;
