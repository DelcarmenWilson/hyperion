"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { LeadExpense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";

import { ExpenseForm } from "./form";
import { ExpenseIncomeCard } from "./card";

import { USDollar } from "@/formulas/numbers";

type ExpenseIncomeProps = {
  leadId: string;
  type: string;
  expenses: LeadExpense[];
  size?: string;
};
export const ExpenseIncome = ({
  leadId,
  type,
  expenses,
  size = "full",
}: ExpenseIncomeProps) => {
  const total = expenses.reduce((sum, exp) => sum + exp.value, 0);
  const [isOpen, setIsOpen] = useState(false);

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
        />
      </DrawerRight>
      <div>
        <div
          className={cn(
            "flex flex-col justify-between items-center border-b p-2 mb-2",
            size == "full" && "lg:flex-row"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-2 items-center ",
              size == "full" && "lg:flex-row"
            )}
          >
            <span className="text-2xl font-semibold">{type}</span>
            <span className=" text-md text-muted-foreground">
              {USDollar.format(total)} / Month
            </span>
          </div>
          <Button onClick={() => setIsOpen(true)}>Add {type}</Button>
        </div>
        {expenses.map((expense) => (
          <ExpenseIncomeCard key={expense.id} expense={expense} />
        ))}
      </div>
    </>
  );
};
