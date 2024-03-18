"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LeadExpense } from "@prisma/client";
import { ExpenseForm } from "./form";
import { ExpenseIncomeCard } from "./card";
import { USDollar } from "@/formulas/numbers";

type ExpenseIncomeProps = {
  leadId: string;
  type: string;
  initExpenses: LeadExpense[];
  onExpenseUpdated: (type: string, newVal: number) => void;
};
export const ExpenseIncome = ({
  leadId,
  type,
  initExpenses,
  onExpenseUpdated,
}: ExpenseIncomeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState(initExpenses);
  const [total, setTotal] = useState(
    initExpenses.reduce((sum, exp) => sum + exp.value, 0)
  );

  const onInserted = (e: LeadExpense) => {
    setExpenses((expenses) => {
      return [...expenses, e];
    });
    let totalExp = total + e.value;
    setTotal(totalExp);
    onExpenseUpdated(type, totalExp);
    setIsOpen(false);
  };

  const onUpdated = (uptype: string, id: string, newVal: number) => {
    let diff = 0;
    if (uptype == "delete") {
      const oldVal = expenses.find((e) => e.id == id)?.value;
      if (oldVal) diff = -oldVal;
      setExpenses((expenses) => {
        return expenses.filter((e) => e.id !== id);
      });
    } else {
      const expense = expenses.find((e) => e.id == id);
      if (expense) {
        diff =
          expense.value > newVal
            ? -(expense.value - newVal)
            : newVal - expense.value;
        expense.value = newVal;
      }
    }
    const expenseTotal = total + diff;
    setTotal(expenseTotal);
    onExpenseUpdated(type, expenseTotal);
  };

  return (
    <>
      <DrawerRight
        title={`New ${type}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ExpenseForm
          leadId={leadId}
          type={type}
          onClose={() => setIsOpen(false)}
          onExpenseInserted={onInserted}
        />
      </DrawerRight>
      <div>
        <div className="flex justify-between items-center border-b p-2 mb-2">
          <div className="">
            <span className="text-2xl font-semibold">{type}</span>
            <span className=" text-md text-muted-foreground">
              {" "}
              - {USDollar.format(total)} / Month
            </span>
          </div>
          <Button onClick={() => setIsOpen(true)}>Add {type}</Button>
        </div>
        {expenses.map((expense) => (
          <ExpenseIncomeCard
            key={expense.id}
            expense={expense}
            onExpenseUpdated={onUpdated}
          />
        ))}
      </div>
    </>
  );
};
