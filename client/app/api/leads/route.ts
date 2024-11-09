import { states } from "@/constants/states";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const leads = await db.lead.findMany({
      include: {
        conversations: true,
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

    if (!user?.id) 
      return new NextResponse("Unauthenticated", { status: 401 });    

    if (!firstName || !lastName) 
      return new NextResponse("Name is required", { status: 400 });    

    if (!address || !city || !state || !zipCode) 
      return new NextResponse("Address is required", { status: 400 });    

    const st = states.find((e) => e.state == state || e.abv == state);
    const phoneNumbers = await db.phoneNumber.findMany({
      where: { agentId: user.id, status: { not: "Deactive" } },
    });

    const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
    const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);

    const lead = await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        homePhone: reFormatPhoneNumber(homePhone),
        cellPhone: reFormatPhoneNumber(cellPhone),
        gender,
        maritalStatus,
        email,
        dateOfBirth,
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        userId: user.id,
        textCode:""
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.log("LEADS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
