import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminCarriersGetAll, adminMedicalConditionsGetAll } from "@/data/admin";

export async function GET(req: Request) {
  try {    
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }
    const carriersAndConditions = await getCarriersAndConditions();
    return NextResponse.json(carriersAndConditions);
  } catch (error) {
    console.log("[ADMIN_CARRIERS&CONDITIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export type GetCarriersAndConditionsResponseType = Awaited<
  ReturnType<typeof getCarriersAndConditions>
>;

async function getCarriersAndConditions() {

  const carriers=await adminCarriersGetAll()
  const conditions=  await adminMedicalConditionsGetAll()

  return {
     carriers,
     conditions
  };
}
