import { adminQuoteUpdateActive } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // const { user } = body;
  await adminQuoteUpdateActive();
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("QUOTE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
