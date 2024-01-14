import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPhoneNumber } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const leads = await db.lead.findMany({
      include: {
        conversation: true
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.log("LEADS_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone,
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
    } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!firstName || !lastName) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!address || !city || !state || !zipCode) {
      return new NextResponse("Address is required", { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        homePhone:formatPhoneNumber(homePhone),
        cellPhone:formatPhoneNumber(cellPhone),
        gender,
        maritalStatus,
        email,
        dateOfBirth,
        owner: user.id,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.log("LEADS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
