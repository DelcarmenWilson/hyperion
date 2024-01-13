import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(
    _req: Request,
    { params }: { params: {  teamId: string } }
  ) {
    try {
  
      if (!params.teamId) {
        return new NextResponse("Team Id Id is required", { status: 400 });
      }  
  
      const team = await db.team.findUnique({
        where: {
          id: params.teamId,
        },
      });
  
      return NextResponse.json(team);
    } catch (error) {
      console.log("[TEAM_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { organizationId: string; teamId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.teamId) {
      return new NextResponse("Team Id is required", { status: 400 });
    }

    if (!params.organizationId) {
      return new NextResponse("Organization Id is required", { status: 400 });
    }

    const organizationByUserId = await db.organization.findFirst({
      where: {
        id: params.organizationId,
        userId: user.id,
      },
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const team = await db.team.updateMany({
      where: {
        id: params.teamId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.log("[TEAM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { organizationId: string; teamId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.teamId) {
      return new NextResponse("Team Id Id is required", { status: 400 });
    }

    if (!params.organizationId) {
      return new NextResponse("Organization Id is required", { status: 400 });
    }

    const organizationByUserId = await db.organization.findFirst({
      where: {
        id: params.organizationId,
        userId: user.id,
      },
    });
    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const team = await db.team.deleteMany({
      where: {
        id: params.teamId,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.log("[TEAM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
