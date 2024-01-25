import { tokenGenerator } from "@/lib/handler";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    return NextResponse.json(tokenGenerator());
  } catch (error) {
    console.log("[TOKEN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body=await req.json()
    return NextResponse.json(tokenGenerator(body.identity));
  } catch (error) {
    console.log("[TOKEN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
