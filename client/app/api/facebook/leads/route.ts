import { Amm_Leads_Import } from "@/formulas/lead";
import { Ad } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
      "id",
      "ad_id",
      "created_time",
      "field_data",
      // "ad_id",
      // "ad_name",
      // "adset_id",
      // "adset_name",
      // "campaign_id",
      // "campaign_name",
      // "created_time",
      // "custom_disclaimer_responses",
      // "field_data",
      // "form_id",
      // "home_listing",
      // "id",
      // "is_organic",
      // "partner_name",
      // "platform",
      // "post",
      // "post_submission_check_result",
      // "retailer_item_id",
      // "vehicle"
    ];
    params = { limit: 1 };
    const ad = new Ad("120211818749810222");
    const leads = await ad.getLeads(fields, params);

    const formattedLeads: any = [];

    leads.forEach((lead: any) => {
      const { ad_id, created_time, field_data, id } = lead;
      const leadData: { [key: string]: string } = {};
      field_data.forEach((data: any) => {
        leadData[data.name] = data.values[0];
      });
      formattedLeads.push({ ad_id, created_time, field_data, id, ...leadData });
    });

    const aamleads = Amm_Leads_Import(
      formattedLeads
    );

    return NextResponse.json(aamleads, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_LEADS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
