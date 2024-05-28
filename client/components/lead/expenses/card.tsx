"use client";
import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { Button } from "@/components/ui/button";
import { LeadExpense } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Check, Trash } from "lucide-react";
import { leadExpenseDeleteById, leadExpenseUpdateById } from "@/actions/lead";
import { toast } from "sonner";

type ExpenseIncomeCardProps = {
  expense: LeadExpense;
};
export const ExpenseIncomeCard = ({ expense }: ExpenseIncomeCardProps) => {
  const [name, setName] = useState(expense.name);
  const [value, setValue] = useState(expense.value.toString());

  const onExpenseUpdate = async () => {
    const updatedExpense = await leadExpenseUpdateById({
      ...expense,
      name,
      value: parseInt(value),
      notes: "",
    });
    if (updatedExpense.success) {
      userEmitter.emit("expenseUpdated", updatedExpense.success);
      toast.success(`${updatedExpense.success.type} updated!`);
    } else toast.error(updatedExpense.error);
  };

  const onExpenseDelete = async () => {
    const deletedExpense = await leadExpenseDeleteById(expense.id);
    if (deletedExpense.success) {
      userEmitter.emit("expenseDeleted", expense.id);
      toast.success(`${deletedExpense.success.type} deleted!`);
    } else toast.error(deletedExpense.error);
  };
  return (
    <div className="grid grid-cols-4 mb-1 items-center gap-2">
      <Input
        className="col-span-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="number"
      />

      <div className="flex gap-2 justify-end">
        {!expense.isDefault && (
          <Button variant="destructive" size="icon" onClick={onExpenseDelete}>
            <Trash size={16} />
          </Button>
        )}
        <Button
          disabled={expense.name == name && expense.value.toString() == value}
          size="icon"
          onClick={onExpenseUpdate}
        >
          <Check size={16} />
        </Button>
      </div>
    </div>
  );
};
