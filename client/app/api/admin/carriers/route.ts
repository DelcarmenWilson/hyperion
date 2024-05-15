import { adminCarriersGetAll } from "@/data/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const carriers=  await adminCarriersGetAll()
    return NextResponse.json(carriers);
  } catch (error) {
    console.log("[ADMIN_CARRIERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
