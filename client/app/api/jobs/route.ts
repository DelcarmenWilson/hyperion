import { NextResponse } from "next/server";
import { calculateBlueprintTargets } from "@/actions/blueprint/blueprint-week";

//calculate blueprint targets
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;
switch(type){

    case "calculateBlueprintTargets":
        // "create a function to calculate blueprints"
      await calculateBlueprintTargets()

        break;

}
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("JOBS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
