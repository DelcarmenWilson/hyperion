import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { leadExpensesGetAllById } from "@/data/lead";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");

  if (!leadId) {
    throw new Error("Lead Id must be difined");
  }

  const expenses = await leadExpensesGetAllById(leadId);

  return Response.json(expenses);
}
