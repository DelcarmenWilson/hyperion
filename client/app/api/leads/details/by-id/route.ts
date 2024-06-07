import { leadGetById } from "@/actions/lead";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId } = body;
   
    const lead = await leadGetById(leadId);

    return NextResponse.json(lead);
  } catch (error) {
    console.log("LEADS_GET_DETAILS_BY_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
