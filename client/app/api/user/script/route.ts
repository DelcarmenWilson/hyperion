import { NextResponse } from "next/server";
import { getScriptOne } from "@/actions/script";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const script = await getScriptOne(null);

    return NextResponse.json(script);
  } catch (error) {
    console.log("SCRIPT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
