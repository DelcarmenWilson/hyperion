import { page } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
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
      
      // "allow_organic_lead",
      // "block_display_for_non_targeted_viewer",
      // "context_card",
      // "created_time",
      // "creator",
      // "expired_leads_count",
      // "follow_up_action_text",
      // "follow_up_action_url",
      // "id",
      // "is_optimized_for_quality",
      // "leads_count",
      // "legal_content",
      // "locale",
      // "name",
      // "organic_leads_count",
      // "page",
      // "page_id",
      // "privacy_policy_url",
      // "question_page_custom_headline",
      // "questions",
      // "status",
      // "thank_you_page",
      // "tracking_parameters"
  ];
    params = {
      limit: 20,
    };

    const forms = await page.getLeadGenForms(fields, params);

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_FORMS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
