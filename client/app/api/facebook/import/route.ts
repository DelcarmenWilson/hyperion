import { account, page } from "@/lib/facebook/config";
import { campaignAdImport } from "@/actions/facebook/ad";
import { campaignAdsetImport } from "@/actions/facebook/adSet";
import { campaignAudienceImport } from "@/actions/facebook/audience";
import { campaignImport } from "@/actions/facebook/campaign";
import { campaignCreativeImport } from "@/actions/facebook/creative";
import {
  CampaignAdSchemaType,
  CampaignAdsetSchemaType,
  CampaignAudienceSchemaType,
  CampaignCreativeSchemaType,
  CampaignFormSchemaType,
  CampaignSchemaType,
} from "@/schemas/campaign";
import { NextRequest, NextResponse } from "next/server";
import { campaignFormImport } from "@/actions/facebook/form";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userid } = body;

    if (!userid) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const params: any = {
      limit: 20,
    };
    await getCreativesToImport(userid, params);
    await getAudienceToImport(userid, params);
    await getCampaingsToImport(userid, params);
    await getAdsetsToImport(params);
    const imported = await getAdsToImport(params);
    return NextResponse.json(imported, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_IMPORT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
const getCampaingsToImport = async (userid: string, params: any) => {
  const fields: any = [
    "id",
    "name",
    "account_id",
    "bid_strategy",
    "buying_type",
    "daily_budget",
    "created_time",
    "objective",
    "smart_promotion_type",
    "source_campaign_id",
    "start_time",
    "status",
    "updated_time",
  ];

  const campaignsToImport: CampaignSchemaType[] = [];
  const formatCampaign = (c: any) => {
    const {
      id,
      name,
      account_id,
      bid_strategy,
      buying_type,
      daily_budget,
      created_time,
      objective,
      smart_promotion_type,
      source_campaign_id,
      status,
      updated_time,
    } = c._data;
    campaignsToImport.push({
      id,
      name,
      account_id,
      bid_strategy,
      buying_type,
      daily_budget,
      objective,
      smart_promotion_type,
      source_campaign_id,
      status,
      user_id: userid,
      created_at: new Date(created_time),
      updated_at: new Date(updated_time),
    });
  };
  let campaigns = await account.getCampaigns(fields, params);

  campaigns.forEach(formatCampaign);
  while (campaigns.hasNext()) {
    campaigns = await campaigns.next();
    campaigns.forEach(formatCampaign);
  }

  const importedCampaigns = await campaignImport(campaignsToImport);
  return importedCampaigns;
};
const getAdsetsToImport = async (params: any) => {
  const adsetFields = [
    "id",
    "campaign_id",
    "name",
    "billing_event",
    "optimization_goal",
    "optimization_sub_event",
    "start_time",
    "status",
    "created_time",
    "updated_time",
  ];

  const adsetsToImport: CampaignAdsetSchemaType[] = [];
  const formatAdset = (c: any) => {
    const {
      id,
      campaign_id,
      name,
      billing_event,
      optimization_goal,
      optimization_sub_event,
      start_time,
      status,
      created_time,
      updated_time,
    } = c._data;
    adsetsToImport.push({
      id,
      campaign_id,
      name,
      billing_event,
      optimization_goal,
      optimization_sub_event,
      start_time: new Date(start_time),
      status,
      created_at: new Date(created_time),
      updated_at: new Date(updated_time),
    });
  };
  let adsets = await account.getAdSets(adsetFields, params);

  adsets.forEach(formatAdset);
  while (adsets.hasNext()) {
    adsets = await adsets.next();
    adsets.forEach(formatAdset);
  }
  const importedAdsets = await campaignAdsetImport(adsetsToImport);
  return importedAdsets;
};

const getAdsToImport = async (params: any) => {
  const fields = [
    "id",
    "name",
    "adset_id",
    "bid_type",
    "demolink_hash",
    "preview_shareable_link",
    "creative",
    "status",
    "created_time",
    "updated_time",
  ];

  const adsToImport: CampaignAdSchemaType[] = [];
  const formatAd = (c: any) => {
    const {
      id,
      adset_id,
      name,
      bid_type,
      demolink_hash,
      preview_shareable_link,
      creative,
      status,
      created_time,
      updated_time,
    } = c._data;
    adsToImport.push({
      id,
      adset_id,
      name,
      bid_type,
      creative_id: creative.id,
      demolink_hash,
      preview_shareable_link,
      status,
      created_at: new Date(created_time),
      updated_at: new Date(updated_time),
    });
  };
  let ads = await account.getAds(fields, params);

  ads.forEach(formatAd);
  while (ads.hasNext()) {
    ads = await ads.next();
    ads.forEach(formatAd);
  }
  const importedAds = await campaignAdImport(adsToImport);
  return importedAds;
};

const getCreativesToImport = async (userid: string, params: any) => {
  const fields = [
    "id",
    "account_id",
    "name",
    "title",
    "body",
    "call_to_action_type",
    "image_hash",
    "image_url",
    "object_type",
    "thumbnail_url",
    "status",
    "video_id",
  ];

  const creativesToImport: CampaignCreativeSchemaType[] = [];
  const formatCreative = (c: any) => {
    const {
      id,
      account_id,
      name,
      title,
      body,
      call_to_action_type,
      image_hash,
      image_url,
      object_type,
      thumbnail_url,
      status,
      video_id,
    } = c._data;
    creativesToImport.push({
      id,
      account_id,
      name,
      title,
      body,
      call_to_action_type,
      image_hash,
      image_url,
      object_type,
      thumbnail_url,
      status,
      video_id,
      user_id: userid,
    });
  };
  let creatives = await account.getAdCreatives(fields, params);

  creatives.forEach(formatCreative);
  while (creatives.hasNext()) {
    creatives = await creatives.next();
    creatives.forEach(formatCreative);
  }
  const importedCreatives = await campaignCreativeImport(creativesToImport);
  return importedCreatives;
};

const getAudienceToImport = async (userid: string, params: any) => {
  const fields = [
    "account",
    "id",
    "name",
    "run_status",
    "sentence_lines",
    "targeting",
    "time_created",
    "time_updated",
  ];

  const audienceToImport: CampaignAudienceSchemaType[] = [];
  const formatAudience = (c: any) => {
    const {
      account,
      id,
      name,
      run_status,
      sentence_lines,
      targeting,
      time_created,
      time_updated,
    } = c._data;
    audienceToImport.push({
      id,
      account_id: account.account_id,
      name,
      run_status,
      created_at: new Date(time_created),
      updated_at: new Date(time_created),
      user_id: userid,
    });
  };
  let audiences = await account.getSavedAudiences(fields, params);

  audiences.forEach(formatAudience);
  while (audiences.hasNext()) {
    audiences = await audiences.next();
    audiences.forEach(formatAudience);
  }
  const importedAudience = await campaignAudienceImport(audienceToImport);
  return audienceToImport;
};

const getFormToImport = async (userid: string, params: any) => {
  const fields = [
    "id",
    "name",
    "allow_organic_lead",
    "block_display_for_non_targeted_viewer",
    "expired_leads_count",
    "follow_up_action_url",
    "leads_count",
    "privacy_policy_url",
    "context_card",
    "question_page_custom_headline",
    "questions",
    "status",
    "created_time",
    "thank_you_page",
  ];

  const formsToImport: CampaignFormSchemaType[] = [];
  const formatForm = (c: any) => {
    const {
      id,
      name,
      allow_organic_lead,
      block_display_for_non_targeted_viewer,
      expired_leads_count,
      follow_up_action_url,
      leads_count,
      privacy_policy_url,
      context_card,
      question_page_custom_headline,
      questions,
      status,
      created_time,
      thank_you_page,
    } = c._data;
    formsToImport.push({
      id,
      name,
      allow_organic_lead,
      block_display_for_non_targeted_viewer,
      expired_leads_count,
      follow_up_action_url,
      leads_count,
      privacy_policy_url,
      question_page_custom_headline,
      status,
      created_at: new Date(created_time),
      user_id: userid,
    });
  };
  let forms = await page.getLeadGenForms(fields, params);

  forms.forEach(formatForm);
  while (forms.hasNext()) {
    forms = await forms.next();
    forms.forEach(formatForm);
  }
  const importedForms = await campaignFormImport(formsToImport);
  return importedForms;
};
