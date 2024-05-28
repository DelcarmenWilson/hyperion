import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

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
  
  const expenses = await LeadExpenseCategories(leadId);
  return Response.json(expenses);
}

export type GetLeadExpenseCategoriesResponseType = Awaited<
  ReturnType<typeof LeadExpenseCategories>
>;

async function LeadExpenseCategories(leadId: string) {
  const expenses = await db.leadExpense.groupBy({
    by: ["type", "name", "value","isDefault"],
    where: {
      leadId,
    },
    orderBy:{
        value:"desc"
    }
  });

  return expenses;
}
