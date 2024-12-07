import { getLeadsToExport } from "@/actions/lead";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId,type, from, to, state, vendor } = body;
    const leads = await getLeadsToExport({
      userId,
      type,
      from,
      to,
      state,
      vendor,
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.log("LEADS_GET_ALL_EXPORT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
