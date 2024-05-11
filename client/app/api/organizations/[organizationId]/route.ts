import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.organizationId) {
      return new NextResponse("Organization Id is required", { status: 400 });
    }

    const organization=await db.organization.updateMany({where:{
        id:params.organizationId,
        userId:user.id
    },data:{
        name
    }})
    return NextResponse.json(organization)
  } catch (error) {
    console.log("[ORGANIZATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { organizationId: string } }
  ) {
    try {
      const user = await currentUser();
      if (!user) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
         
      if (!params.organizationId) {
        return new NextResponse("Organization Id is required", { status: 400 });
      }
  
      const organization=await db.organization.deleteMany({where:{
          id:params.organizationId,
          userId:user.id
      }})

      return NextResponse.json(organization)
    } catch (error) {
      console.log("[ORGANIZATION_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }