import { NextResponse } from "next/server";
import { calculateBlueprintTargets } from "@/actions/blueprint/blueprint-week";
import { adminQuoteUpdateActive } from "@/actions/admin/quote";

//calculate blueprint targets
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;
    switch (type) {
      case "calculateBlueprintTargets":
        await calculateBlueprintTargets();
        break;
      case "newQuote":
        await adminQuoteUpdateActive();
        break;
    }

    return NextResponse.json({
      success: `${type} job has ran successfully`,
      status: 200,
    });
    // return NextResponse.json({ success: 'Job has ran successfully', status: 200 });
  } catch (error) {
    console.log("JOBS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
