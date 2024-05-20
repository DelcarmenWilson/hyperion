"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";

import { Button } from "@/components/ui/button";
import { ExpenseIncome } from "./expense-income";

import { LeadExpense } from "@prisma/client";
import { leadExpenseInsertSheet } from "@/actions/lead";
import { USDollar } from "@/formulas/numbers";

type ExpensesClientProp = {
  leadId: string;
  initExpenses: LeadExpense[];
  size?: string;
};

export const ExpensesClient = ({
  leadId,
  initExpenses,
  size = "full",
}: ExpensesClientProp) => {
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
    toast.success(
      JSON.stringify({ exp: expenseTotal, inc: incomeTotal, ttl: total })
    );
    if (type.toLocaleLowerCase() == "expense") expenseTotal = newValue;
    else incomeTotal = newValue;

    calculateIncome(expenseTotal, incomeTotal);
  };
  useEffect(() => {
    const expenseTotal = data.expenses.reduce((sum, exp) => sum + exp.value, 0);
    const incomeTotal = data.income.reduce((sum, inc) => sum + inc.value, 0);
    calculateIncome(expenseTotal, incomeTotal);
    userEmitter.on("expenseUpdated", (type, total) =>
      onExpenseUpdated(type, total)
    );
    return () => {
      userEmitter.on("expenseUpdated", (type, total) =>
        onExpenseUpdated(type, total)
      );
    };
  }, []);
  return (
    <div>
      {data.expenses.length ? (
        <>
          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              size == "full" && "lg:grid-cols-2"
            )}
          >
            <ExpenseIncome
              leadId={leadId}
              type="Expense"
              initExpenses={data.expenses}
              size={size}
            />
            <ExpenseIncome
              leadId={leadId}
              type="Income"
              initExpenses={data.income}
              size={size}
            />
          </div>
          <p
            className={cn(
              "flex flex-col  items-center justify-center text-lg gap-2 mt-2",
              size == "full" && "lg:flex-row"
            )}
          >
            <span className="italic">Expendable Income</span>
            <span
              className={cn(
                "font-bold",
                expendableIncome <= 60 && "text-destructive"
              )}
            >
              {USDollar.format(expendableIncome)}
            </span>
            <span> / Month</span>
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
