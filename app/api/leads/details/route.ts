import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;
    const lead = await db.lead.findFirst({ where: { cellPhone: phone } });    
    
    if(!lead){
      return NextResponse.json({});
    }
    return NextResponse.json(lead);
    
  } catch (error) {
    console.log("LEADS_GET_DETAILS_BY_PHONE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
