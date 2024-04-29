import { NextRequest, NextResponse } from "next/server";
import { formatObject } from "@/formulas/objects";
import { hyperionLeadInsert } from "@/actions/hyperion";

export async function GET(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get("hub.mode"),
      token = req.nextUrl.searchParams.get("hub.verify_token"),
      challenge = req.nextUrl.searchParams.get("hub.challenge");

    if (mode && token) {
      if (mode === "subscribe" && token === "Hyperion") {
        console.log("FACEBOOK_VERIFIED");
        return new NextResponse(challenge, { status: 200 });
      } else {
        return new NextResponse("Data did not match", { status: 403 });
      }
    }
  } catch (error) {
    console.log("FACEBOOK_VERIFY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const j: any = formatObject(body);

    const newLead = await hyperionLeadInsert({
      id: j.iD,
      formId: j.formId,
      adName: j.adName,
      campaignName: j.campaignName,
      firstName: j.firstName,
      lastName: j.lastName,
      address: j.streeAddress,
      city: j.city,
      state: j.state,
      cellPhone: j.phoneNumber,
      gender: j.gender,
      maritalStatus: j.maritalStatus,
      email: j.email,
      dateOfBirth: new Date(j.dateOfBirth),
      weight: j.couldYouPleaseProvideYourCurrentWeight,
      height: j.couldYouPleaseProvideYourCurrentHeightAndWeight,
      policyAmount: j.howMuchInsuranceCoverageWillYouLikeToGet,
      smoker: j.areYouASmoker,
    });
    if (newLead.error) {
      return new NextResponse(newLead.error, { status: 500 });
    }
    return new NextResponse(newLead.success, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
