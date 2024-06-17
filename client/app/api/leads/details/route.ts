import { leadGetByPhone } from "@/actions/lead";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;
    const lead = await leadGetByPhone(phone)  
    
    if(!lead){
      return NextResponse.json(null);
    }
    return NextResponse.json(lead);
    
  } catch (error) {
    console.log("LEADS_GET_DETAILS_BY_PHONE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
