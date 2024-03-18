"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LeadExpense } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Check, Trash } from "lucide-react";
import { leadExpenseDeleteById, leadExpenseUpdateById } from "@/actions/lead";
import { toast } from "sonner";

type ExpenseIncomeCardProps = {
  expense: LeadExpense;
  onExpenseUpdated: (type: string, id: string, newVal: number) => void;
};
export const ExpenseIncomeCard = ({
  expense,
  onExpenseUpdated,
}: ExpenseIncomeCardProps) => {
  const [name, setName] = useState(expense.name);
  const [value, setValue] = useState(expense.value.toString());

  const onExpenseUpdate = () => {
    leadExpenseUpdateById(expense.id, name, parseInt(value)).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        onExpenseUpdated("update", expense.id, parseInt(value));
        toast.success(data.success);
      }
    });
  };

  const onExpenseDelete = () => {
    leadExpenseDeleteById(expense.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        onExpenseUpdated("delete", expense.id, 0);
        toast.success(data.success);
      }
    });
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
            <Trash />
          </Button>
        )}
        <Button
          disabled={expense.name == name && expense.value.toString() == value}
          size="icon"
          onClick={onExpenseUpdate}
        >
          <Check />
        </Button>
      </div>
    </div>
  );
};
