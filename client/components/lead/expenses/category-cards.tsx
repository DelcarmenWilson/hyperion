"use client";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ExpenseType } from "@/types";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { GetLeadExpenseCategoriesResponseType } from "@/app/api/leads/expense/categories/route";
import { EmptyCard } from "@/components/reusable/empty-card";
import { USDollar } from "@/formulas/numbers";
import CreateExpenseForm from "./create-expense-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CatergoryCards = ({ leadId }: { leadId: string }) => {
  const expenseQuery = useQuery<GetLeadExpenseCategoriesResponseType>({
    queryKey: ["leadexpense", "balance", "categories"],
    queryFn: () =>
      fetch(`/api/leads/expense/categories?leadId=${leadId}`).then((res) =>
        res.json()
      ),
  });

  return (
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
  );
};

export default CatergoryCards;

type CategoriesCardProps = {
  leadId: string;
  type: ExpenseType;
  data: GetLeadExpenseCategoriesResponseType;
};
const CategoriesCard = ({ leadId, data, type }: CategoriesCardProps) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el.value || 0), 0);

  return (
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
                      >
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        Edit
                      </Button>
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
  );
};
