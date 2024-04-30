import { adminQuoteUpdateActive } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const newQuote = await adminQuoteUpdateActive();
    if (!newQuote.success) {
      return NextResponse.json({ error: "Quote was not updated", status: 200 });
    }
    return NextResponse.json({ success: newQuote.success, status: 200 });
  } catch (error) {
    console.log("QUOTE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
