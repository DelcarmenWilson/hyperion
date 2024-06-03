import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminMedicalConditionsGetAll } from "@/data/admin";

export async function GET(req: Request) {
  try {   
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }
    const conditions=  await adminMedicalConditionsGetAll()
    return NextResponse.json(conditions);
  } catch (error) {
    console.log("[ADMIN_CONDITIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
