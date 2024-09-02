import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
      "ad_active_time",
      "ad_review_feedback",
      "adlabels",
      "adset_id",
      "bid_amount",
      "bid_info",
      "bid_type",
      "configured_status",
      "conversion_domain",
      "conversion_specs",
      "created_time",
      "creative",
      "demolink_hash",

      "engagement_audience",
      "id",
      "name",
      "preview_shareable_link",
      "priority",
      "recommendations",
      "status",
      "targeting",
      "updated_time",

      // "account_id",
      // "ad_active_time",
      // "ad_review_feedback",
      // "ad_schedule_end_time",
      // "ad_schedule_start_time",
      // "adlabels",
      // "adset",
      // "adset_id",
      // "bid_amount",
      // "bid_info",
      // "bid_type",
      // "campaign",
      // "campaign_id",
      // "configured_status",
      // "conversion_domain",
      // "conversion_specs",
      // "created_time",
      // "creative",
      // "creative_asset_groups_spec",
      // "demolink_hash",
      // "display_sequence",
      // "effective_status",
      // "engagement_audience",
      // "failed_delivery_checks",
      // "id",
      // "issues_info",
      // "last_updated_by_app_id",
      // "name",
      // "preview_shareable_link",
      // "priority",
      // "recommendations",
      // "source_ad",
      // "source_ad_id",
      // "status",
      // "targeting",
      // "tracking_and_conversion_with_defaults",
      // "tracking_specs",
      // "updated_time"
    ];
    params = {
      limit: 20,
    };

    let ads = await account.getAds(fields, params);

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_ADS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
