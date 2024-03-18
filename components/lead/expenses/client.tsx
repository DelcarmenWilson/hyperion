"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ExpenseIncome } from "./expense-income";

import { LeadExpense } from "@prisma/client";
import { leadExpenseInsertSheet } from "@/actions/lead";
import { USDollar } from "@/formulas/numbers";
import { cn } from "@/lib/utils";

type ExpensesWrapperClientProp = {
  leadId: string;
  initExpenses: LeadExpense[];
};

export const ExpensesWrapperClient = ({
  leadId,
  initExpenses,
}: ExpensesWrapperClientProp) => {
  const [data, setData] = useState<{
    expenses: LeadExpense[];
    income: LeadExpense[];
  }>({
    expenses: initExpenses.filter((e) => e.type == "Expense"),
    income: initExpenses.filter((e) => e.type == "Income"),
  });
  const [total, setTotal] = useState<{ expenses: number; income: number }>({
    expenses: 0,
    income: 0,
  });
  const [expendableIncome, setExpendableIncome] = useState(
    total.income - total.expenses
  );

  const onCreateExpenseSheet = () => {
    leadExpenseInsertSheet(leadId).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        setData({
          expenses: data.success.filter((e) => e.type == "Expense"),
          income: data.success.filter((e) => e.type == "Income"),
        });
        toast.success("Expense Sheet Created");
      }
    });
  };
  const calculateIncome = (expenseTotal: number, incomeTotal: number) => {
    setTotal({ expenses: expenseTotal, income: incomeTotal });
    setExpendableIncome(incomeTotal - expenseTotal);
  };
  const onExpenseUpdated = (type: string, newValue: number) => {
    let expenseTotal = total.expenses;
    let incomeTotal = total.income;
    if (type == "Expense") {
      expenseTotal = newValue;
    } else {
      incomeTotal = newValue;
    }
    calculateIncome(expenseTotal, incomeTotal);
  };
  useEffect(() => {
    const expenseTotal = data.expenses.reduce((sum, exp) => sum + exp.value, 0);
    const incomeTotal = data.income.reduce((sum, inc) => sum + inc.value, 0);
    calculateIncome(expenseTotal, incomeTotal);
  }, [data]);
  return (
    <div>
      {data.expenses.length ? (
        <>
          <div className=" grid grid-cols-2 gap-4">
            <ExpenseIncome
              leadId={leadId}
              type="Expense"
              initExpenses={data.expenses}
              onExpenseUpdated={onExpenseUpdated}
            />
            <ExpenseIncome
              leadId={leadId}
              type="Income"
              initExpenses={data.income}
              onExpenseUpdated={onExpenseUpdated}
            />
          </div>
          <p className="flex gap-2 items-center justify-center text-2xl mt-2">
            <span className="italic">Expandable Income</span>
            <span
              className={cn(
                "font-bold",
                expendableIncome <= 60 && "text-destructive"
              )}
            >
              {USDollar.format(expendableIncome)}
            </span>
          </p>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Button onClick={onCreateExpenseSheet}>Create Expense Sheet</Button>
        </div>
      )}
    </div>
  );
};
