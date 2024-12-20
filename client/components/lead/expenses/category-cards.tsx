"use client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ExpenseType } from "@/types";
import { cn } from "@/lib/utils";
import {
  useLeadExpenseActions,
  useLeadExpenseData,
} from "@/hooks/lead/use-expense";

import { LeadExpense } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateExpenseForm from "./create-expense-form";
import DeleteDialog from "@/components/custom/delete-dialog";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import { USDollar } from "@/formulas/numbers";
import { Edit, Plus } from "lucide-react";

export const CatergoryCards = ({
  leadId,
  size,
}: {
  leadId: string;
  size: string;
}) => {
  const { onGetLeadExpense } = useLeadExpenseData(leadId);
  const { leadExpense, leadExpenseFetching } = onGetLeadExpense();
  const { onCreateLeadExpense, leadExpenseCreating } =
    useLeadExpenseActions(leadId);

  return (
    <>
      <div
        className={cn(
          "flex-1 flex w-full h-full gap-2 overflow-hidden pb-2",
          size == "sm" && "flex-col"
        )}
      >
        {["Expense", "Income"].map((type) => (
          <SkeletonWrapper
            key={type}
            isLoading={leadExpenseFetching}
            fullHeight
          >
            <CategoriesCard
              leadId={leadId!}
              type={type as ExpenseType}
              data={leadExpense || []}
              size={size}
            />
          </SkeletonWrapper>
        ))}
      </div>
      {!leadExpense?.length && !leadExpenseFetching && (
        <div className="flex-center h-full">
          <Button
            disabled={leadExpenseCreating || leadExpenseFetching}
            onClick={() => onCreateLeadExpense(leadId!)}
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
  size: string;
};
const CategoriesCard = ({ leadId, data, type, size }: CategoriesCardProps) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el.value || 0), 0);

  const { onDeleteLeadExpense, leadExpenseDeleting } =
    useLeadExpenseActions(leadId);

  return (
    <>
      <Card className="flex flex-col w-full h-full overflow-hidden">
        <CardHeader className={cn(size == "sm" && "!p-2")}>
          <CardTitle
            className={cn(
              "flex flex-col justify-between items-center gap-2 text-muted-foreground md:flex-row"
            )}
          >
            {type === "Income" ? "Incomes" : "Expenses"}

            <CreateExpenseForm
              trigger={
                <Button
                  variant={"outline"}
                  size={size == "sm" ? "icon" : "default"}
                  className={cn(
                    "hover:text-white",
                    type == "Income"
                      ? "border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 "
                      : "border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
                  )}
                >
                  {size == "sm" ? <Plus size={15} /> : <span>New {type}</span>}
                </Button>
              }
              leadId={leadId}
              type={type}
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 h-full w-full overflow-hidden">
          <ScrollArea className="h-full pr-2">
            {filteredData.map((item) => {
              const amount = item.value || 0;
              const percentage = (amount * 100) / (total || amount) || 0;

              return (
                <div
                  key={item.name}
                  className={cn(
                    "flex flex-col w-full gap-2 mb-1 group",
                    size == "sm" && "gap-1"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      size == "sm" && "flex-col items-start "
                    )}
                  >
                    <p className={cn("flex gap-1 items-center text-gray-400")}>
                      <span className={cn(size == "sm" && "text-sm")}>
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </p>
                    <div
                      className={cn(
                        "flex gap-1 items-center",
                        size == "sm" &&
                          "flex-row-reverse justify-between w-full"
                      )}
                    >
                      {!item.isDefault && (
                        <DeleteDialog
                          title={type}
                          cfText="delete"
                          onConfirm={() => onDeleteLeadExpense(item.id)}
                          loading={leadExpenseDeleting}
                          onlyIcon
                          btnClass="w-fit opacity-0 group-hover:opacity-100"
                        />
                      )}

                      <CreateExpenseForm
                        trigger={
                          <Button
                            variant="ghost"
                            size={size == "sm" ? "icon" : "sm"}
                            className="opacity-0 group-hover:opacity-100"
                          >
                            {size == "sm" ? (
                              <Edit size={16} />
                            ) : (
                              <span>Edit</span>
                            )}
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

          {!filteredData.length && (
            <EmptyCard
              title="No data found"
              subTitle={`Start by adding a new ${
                type === "Income" ? "incomes" : "expenses"
              }`}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};
