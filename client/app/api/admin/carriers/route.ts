import { NextResponse } from "next/server";
import { adminCarriersGetAll } from "@/actions/admin/carrier";

export async function POST(req: Request) {
  try {
    const carriers=  await adminCarriersGetAll()
    return NextResponse.json(carriers);
  } catch (error) {
    console.log("[ADMIN_CARRIERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
