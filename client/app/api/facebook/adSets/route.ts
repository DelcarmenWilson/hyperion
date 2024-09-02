import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
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
      
     
      // "account_id",
      // "adlabels",
      // "adset_schedule",
      // "asset_feed_id",
      // "attribution_spec",
      // "bid_adjustments",
      // "bid_amount",
      // "bid_constraints",
      // "bid_info",
      // "bid_strategy",
      // "billing_event",
      // "budget_remaining",
      // "campaign",
      // "campaign_active_time",
      // "campaign_attribution",
      // "campaign_id",
      // "configured_status",
      // "created_time",
      // "creative_sequence",
      // "daily_budget",
      // "daily_min_spend_target",
      // "daily_spend_cap",
      // "destination_type",
      // "dsa_beneficiary",
      // "dsa_payor",
      // "effective_status",
      // "end_time",
      // "existing_customer_budget_percentage",
      // "frequency_control_specs",
      // "full_funnel_exploration_mode",
      // "id",
      // "instagram_actor_id",
      // "is_budget_schedule_enabled",
      // "is_dynamic_creative",
      // "issues_info",
      // "learning_stage_info",
      // "lifetime_budget",
      // "lifetime_imps",
      // "lifetime_min_spend_target",
      // "lifetime_spend_cap",
      // "multi_optimization_goal_weight",
      // "name",
      // "optimization_goal",
      // "optimization_sub_event",
      // "pacing_type",
      // "promoted_object",
      // "recommendations",
      // "recurring_budget_semantics",
      // "regional_regulated_categories",
      // "regional_regulation_identities",
      // "review_feedback",
      // "rf_prediction_id",
      // "source_adset",
      // "source_adset_id",
      // "start_time",
      // "status",
      // "targeting",
      // "targeting_optimization_types",
      // "time_based_ad_rotation_id_blocks",
      // "time_based_ad_rotation_intervals",
      // "updated_time",
      // "use_new_app_click"
    ];
    params = {
      limit: 20,
    };

    let adsets = await account.getAdSets(fields, params);

    return NextResponse.json(adsets, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_ADSETS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
