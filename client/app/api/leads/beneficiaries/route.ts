import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {  getLeadBeneficiaries } from "@/actions/lead/beneficiary";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) {
    throw new Error("Lead Id must be provided");
  }

  const beneficiaries = await getLeadBeneficiaries(leadId);

  return Response.json(beneficiaries);
}
