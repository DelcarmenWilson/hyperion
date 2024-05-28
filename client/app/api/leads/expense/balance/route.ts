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
  
console.log(leadId)
  if (!leadId) {
    return Response.json("Lead Id must be provided", {
      status: 400,
    });
  }

  const balance = await getLeadExpenseBalance(
    leadId  );

  return Response.json(balance);
}

export type GetLeadExpenseResponseType = Awaited<
  ReturnType<typeof getLeadExpenseBalance>
>;

async function getLeadExpenseBalance(leadId:string) {
  const totals = await db.leadExpense.groupBy({
    by: ["type"],
    where: {
      leadId,
    },
    _sum: {
        value: true,
    },
  });

  return {
    expense: totals.find((e) => e.type === "Expense")?._sum.value || 0,
    income: totals.find((e) => e.type === "Income")?._sum.value || 0,
  };
}
