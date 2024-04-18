import { NextResponse } from "next/server";
import { scriptGetOne } from "@/data/script";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const script = await scriptGetOne();

    return NextResponse.json(script);
  } catch (error) {
    console.log("SCRIPT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
