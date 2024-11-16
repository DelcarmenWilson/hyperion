import { Ad } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
  try {
    let fields: any, params: any;
    fields = ["ad_id", "created_time", "field_data", "id"];
    params = {};
    const ad = new Ad("120211818749810222");
    const leads = await ad.getLeads(fields, params);

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_LEADS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
