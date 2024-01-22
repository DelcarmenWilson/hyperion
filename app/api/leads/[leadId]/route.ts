import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    if (!params.leadId) {
      return new NextResponse("Lead Id is required", { status: 400 });
    }

    const lead = await db.lead.findUnique({
      where: {
        id: params.leadId,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.log("[LEAD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      homePhone,
      cellPhone,
      address,
      city,
      state,
      zipCode,
      email,
      gender,
      maritalStatus,
    } = body;

    if (!firstName || !lastName) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    if (!email || !cellPhone) {
      return new NextResponse("Email or mobile is required", { status: 400 });
    }

    if (!address || !city || !state || !zipCode) {
      return new NextResponse("Address is required", { status: 400 });
    }

    if (!params.leadId) {
      return new NextResponse("Lead Id is required", { status: 400 });
    }

    const leadByUser = await db.lead.findFirst({
      where: {
        id: params.leadId,
        owner: user.id,
      },
    });

    if (!leadByUser) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const team = await db.lead.updateMany({
      where: {
        id: params.leadId,
      },
      data: {
        firstName,
        lastName,
        homePhone:reFormatPhoneNumber(homePhone),
        cellPhone:reFormatPhoneNumber(cellPhone),
        address,
        state,
        city,
        zipCode,
        email,
        gender,
        maritalStatus,
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.log("[LEAD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.leadId) {
      return new NextResponse("Lead Id Id is required", { status: 400 });
    }

    const leadByUser = await db.lead.findFirst({
      where: {
        id: params.leadId,
        owner: user.id,
      },
    });

    if (!leadByUser) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const team = await db.team.deleteMany({
      where: {
        id: params.leadId,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.log("[LEAD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
