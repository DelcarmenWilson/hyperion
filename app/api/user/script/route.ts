import { scriptGetOne } from "@/data/script";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const script = await scriptGetOne();

    return NextResponse.json(script);
  } catch (error) {
    console.log("[LEADSTATUS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}