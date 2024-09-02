import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
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
      "updated_time"
      // "account_id",
      // "adlabels",
      // "bid_strategy",
      // "boosted_object_id",
      // "brand_lift_studies",
      // "budget_rebalance_flag",
      // "budget_remaining",
      // "buying_type",
      // "campaign_group_active_time",
      // "can_create_brand_lift_study",
      // "can_use_spend_cap",
      // "configured_status",
      // "created_time",
      // "daily_budget",
      // "effective_status",
      // "has_secondary_skadnetwork_reporting",
      // "id",
      // "is_budget_schedule_enabled",
      // "is_skadnetwork_attribution",
      // "issues_info",
      // "last_budget_toggling_time",
      // "lifetime_budget",
      // "name",
      // "objective",
      // "pacing_type",
      // "primary_attribution",
      // "promoted_object",
      // "recommendations",
      // "smart_promotion_type",
      // "source_campaign",
      // "source_campaign_id",
      // "special_ad_categories",
      // "special_ad_category",
      // "special_ad_category_country",
      // "spend_cap",
      // "start_time",
      // "status",
      // "stop_time",
      // "topline_id",
      // "updated_time",
    ];
    params = {
      limit: 20,
    };

    let campaigns = await account.getCampaigns(fields, params);

    // campaigns.forEach((c) => {

    // });
    // while (campaigns.hasNext()) {
    //   campaigns = await campaigns.next();
    //   campaigns.forEach((c) => console.log(c.name));
    // }

    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_CAMPAIGN_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
