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
