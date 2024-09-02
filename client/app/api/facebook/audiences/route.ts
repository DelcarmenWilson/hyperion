import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [      
        "account",
        "id",
        "name", 
        "run_status",
        "sentence_lines",
        "targeting",
        "time_created",
        "time_updated"
        // "account",
        // "approximate_count_lower_bound",
        // "approximate_count_upper_bound",
        // "delete_time",
        // "description",
        // "id",
        // "name",
        // "operation_status",
        // "owner_business",
        // "page_deletion_marked_delete_time",
        // "permission_for_actions",
        // "run_status",
        // "sentence_lines",
        // "targeting",
        // "time_created",
        // "time_updated"
      
     
    ];
    params = {
      limit: 20,
    };

    let audiences = await account.getSavedAudiences(fields, params);   

    return NextResponse.json(audiences, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_AUDIENCES_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
