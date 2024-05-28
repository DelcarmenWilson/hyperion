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
import BalanceCards from "./balance-cards";
import CatergoryCards from "./category-cards";

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
  const [expenses, setExpenses] = useState(initExpenses);

  const [expendableIncome, setExpendableIncome] = useState(0);

  const onCreateExpenseSheet = async () => {
    const insertedExpenseSheet = await leadExpenseInsertSheet(leadId);

    if (insertedExpenseSheet.success) {
      setExpenses(insertedExpenseSheet.success);
      toast.success("Expense Sheet Created");
    } else toast.error(insertedExpenseSheet.error);
  };
  const calculateIncome = () => {
    const expenseTotal = expenses
      .filter((e) => e.type == "Expense")
      .reduce((sum, exp) => sum + exp.value, 0);
    const incomeTotal = expenses
      .filter((e) => e.type == "Income")
      .reduce((sum, inc) => sum + inc.value, 0);
    setExpendableIncome(incomeTotal - expenseTotal);
  };
  useEffect(() => {
    calculateIncome();
  }, [expenses]);

  useEffect(() => {
    const onExpenseDeleted = (id: string) => {
      setExpenses((expenses) => {
        if (!expenses) return expenses;
        return expenses.filter((e) => e.id !== id);
      });
    };
    const onExpenseInserted = (newExpense: LeadExpense) => {
      const existing = expenses?.find((e) => e.id == newExpense.id);
      if (existing == undefined)
        setExpenses((expenses) => [...expenses!, newExpense]);
    };

    const onExpenseUpdated = (updatedExpense: LeadExpense) => {
      setExpenses((expenses) => {
        if (!expenses) return expenses;
        return expenses.map((expense) => {
          if (expense.id == updatedExpense.id) {
            expense = updatedExpense;
          }
          return expense;
        });
      });
    };
    userEmitter.on("expenseDeleted", (id) => onExpenseDeleted(id));
    userEmitter.on("expenseInserted", (info) => onExpenseInserted(info));
    userEmitter.on("expenseUpdated", (info) => onExpenseUpdated(info));
  }, []);
  return (
    <div>
      {expenses.length ? (
        <>
          <div className="flex w-full flex-col gap-2">
            <BalanceCards leadId={leadId} />

            <CatergoryCards leadId={leadId} />
          </div>
          {/* <div
            className={cn(
              "grid grid-cols-1 gap-4",
              size == "full" && "lg:grid-cols-2"
            )}
          >
            <ExpenseIncome
              leadId={leadId}
              type="Expense"
              expenses={expenses.filter((e) => e.type == "Expense")}
              size={size}
            />
            <ExpenseIncome
              leadId={leadId}
              type="Income"
              expenses={expenses.filter((e) => e.type == "Income")}
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
          </p> */}
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Button onClick={onCreateExpenseSheet}>Create Expense Sheet</Button>
        </div>
      )}
    </div>
  );
};
