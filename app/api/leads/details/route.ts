import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body=await req.json()
    const {phone}=body
    const leads = await db.lead.findMany({where:{cellPhone:phone}
    });

    return NextResponse.json(leads[0]);
  } catch (error) {
    console.log("LEADS_GET_DETAILS_BY_PHONE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


