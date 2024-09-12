"use client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ExpenseType } from "@/types";
import { cn } from "@/lib/utils";
import { useLeadExpenseActions } from "@/hooks/lead/use-expense";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertModal } from "@/components/modals/alert";
import { EmptyCard } from "@/components/reusable/empty-card";
import { USDollar } from "@/formulas/numbers";
import CreateExpenseForm from "./create-expense-form";
import { Button } from "@/components/ui/button";
import { LeadExpense } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CatergoryCards = () => {
  const {
    leadId,
    leadExpense,
    isFetchingLeadExpense,
    leadExpenseMutate,
    isPendingExpense,
  } = useLeadExpenseActions();

  return (
    <>
      {leadExpense?.length ? (
        <div className="flex-1 flex w-full h-full flex-wrap gap-2 md:flex-nowrap overflow-hidden">
          {["Expense", "Income"].map((type) => (
            <SkeletonWrapper key={type} isLoading={isFetchingLeadExpense}>
              <CategoriesCard
                leadId={leadId!}
                type={type as ExpenseType}
                data={leadExpense || []}
              />
            </SkeletonWrapper>
          ))}
        </div>
      ) : (
        <div className="flex-center h-full">
          <Button
            disabled={isPendingExpense || isFetchingLeadExpense}
            onClick={() => leadExpenseMutate(leadId!)}
          >
            Create Expense Sheet
          </Button>
        </div>
      )}
    </>
  );
};

type CategoriesCardProps = {
  leadId: string;
  type: ExpenseType;
  data: LeadExpense[];
};
const CategoriesCard = ({ leadId, data, type }: CategoriesCardProps) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el.value || 0), 0);

  const {
    alertOpen,
    setAlertOpen,
    onSelectedExpense,
    onExpenseDelete,
    isPendingLeadExpenseDelete,
  } = useLeadExpenseActions();

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onExpenseDelete}
        loading={isPendingLeadExpenseDelete}
        height="auto"
      />
      <Card className="flex flex-col w-full h-full">
        <CardHeader>
          <CardTitle className="flex flex--col justify-between items-center gap-2 text-muted-foreground md:flex-row">
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

        <CardContent className="flex-1 h-full overflow-hidden">
          {!filteredData.length ? (
            <EmptyCard
              title="No data found"
              subTitle={`Start by adding a new ${
                type === "Income" ? "incomes" : "expenses"
              }`}
            />
          ) : (
            <ScrollArea className="h-full pr-2">
              {filteredData.map((item) => {
                const amount = item.value || 0;
                const percentage = (amount * 100) / (total || amount) || 0;

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
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </>
  );
};
