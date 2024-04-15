import { adminMedicalConditionsGetAll } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const conditions=  await adminMedicalConditionsGetAll()
    return NextResponse.json(conditions);
  } catch (error) {
    console.log("[ADMIN_CONDITIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
