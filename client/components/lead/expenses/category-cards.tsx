"use client";
import React, { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ExpenseType } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertModal } from "@/components/modals/alert";
import { EmptyCard } from "@/components/reusable/empty-card";
import { USDollar } from "@/formulas/numbers";
import CreateExpenseForm from "./create-expense-form";
import { Button } from "@/components/ui/button";
import { LeadExpense } from "@prisma/client";
import { leadExpenseDeleteById, leadExpenseInsertSheet } from "@/actions/lead";

const CatergoryCards = ({ leadId }: { leadId: string }) => {
  const queryClient = useQueryClient();
  const expenseQuery = useQuery<LeadExpense[]>({
    queryKey: ["leadExpense", `lead-${leadId}`, "categories"],
    queryFn: () =>
      fetch(`/api/leads/expense/categories?leadId=${leadId}`).then((res) =>
        res.json()
      ),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: leadExpenseInsertSheet,
    onSuccess: () => {
      toast.success("Expense Sheet Created", {
        id: "create-expense-sheet",
      });
      queryClient.invalidateQueries({
        queryKey: ["leadExpense", `lead-${leadId}`],
      });
    },
  });

  return (
    <>
      {expenseQuery.data?.length ? (
        <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
          {["Expense", "Income"].map((type) => (
            <SkeletonWrapper key={type} isLoading={expenseQuery.isFetching}>
              <CategoriesCard
                leadId={leadId}
                type={type as ExpenseType}
                data={expenseQuery.data || []}
              />
            </SkeletonWrapper>
          ))}
        </div>
      ) : (
        <div className="flex-center h-full">
          <Button disabled={isPending} onClick={() => mutate(leadId)}>
            Create Expense Sheet
          </Button>
        </div>
      )}
    </>
  );
};

export default CatergoryCards;

type CategoriesCardProps = {
  leadId: string;
  type: ExpenseType;
  data: LeadExpense[];
};
const CategoriesCard = ({ leadId, data, type }: CategoriesCardProps) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const queryClient = useQueryClient();
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el.value || 0), 0);
  const [selectedExpense, setSelectedExpense] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: leadExpenseDeleteById,
    onSuccess: () => {
      toast.success("Transaction deleted succesfully", {
        id: "delete-transaction",
      });
      queryClient.invalidateQueries({
        queryKey: ["leadExpense", `lead-${leadId}`],
      });

      setAlertOpen((prev) => !prev);
    },
  });

  const onSelectedExpense = (id: string) => {
    setSelectedExpense(id);
    setAlertOpen(true);
  };
  const onDelete = useCallback(() => {
    toast.loading("Deleting transaction...", { id: "delete-transaction" });
    mutate(selectedExpense);
  }, [mutate, selectedExpense]);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
        height="auto"
      />
      <Card className="min-h-80 w-full col-span-6">
        <CardHeader>
          <CardTitle className="grid grid-flow-row justify-between items-center gap-2 text-muted-foreground md:grid-flow-col">
            {type === "Income" ? "Incomes" : "Expenses"}

            <CreateExpenseForm
              trigger={
                <Button
                  variant={"outline"}
                  className={cn(
                    "hover:text-white",
                    type == "Income"
                      ? "border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 "
                      : "border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
                  )}
                >
                  New {type}
                </Button>
              }
              leadId={leadId}
              type={type}
            />
          </CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between gap-2">
          {filteredData.length === 0 && (
            <EmptyCard
              title="No data found"
              subTitle={`Start by adding a new ${
                type === "Income" ? "incomes" : "expenses"
              }`}
            />
          )}

          {filteredData.length > 0 && (
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item.value || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between group">
                      <span className="flex items-center text-gray-400">
                        {item.name}

                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <div className="flex gap-1 items-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className={cn(
                            "opacity-0",
                            item.isDefault ? "" : "group-hover:opacity-100"
                          )}
                          onClick={() => onSelectedExpense(item.id)}
                        >
                          Delete
                        </Button>

                        <CreateExpenseForm
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100"
                            >
                              Edit
                            </Button>
                          }
                          expense={item}
                          leadId={leadId}
                          type={type}
                        />

                        <span className="text-sm text-gray-400">
                          {USDollar.format(item.value)}
                        </span>
                      </div>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === "Income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
