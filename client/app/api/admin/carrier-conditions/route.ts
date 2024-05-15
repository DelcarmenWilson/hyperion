import { adminCarriersGetAll, adminMedicalConditionsGetAll } from "@/data/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const carriers=await adminCarriersGetAll()
    const conditions=  await adminMedicalConditionsGetAll()
    return NextResponse.json({carriers,conditions});
  } catch (error) {
    console.log("[ADMIN_CARRIERS&CONDITIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
