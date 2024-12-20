"use client";
import React, { ReactNode } from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useLeadExpenseData } from "@/hooks/lead/use-expense";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";

import { USDollar } from "@/formulas/numbers";
import { cn } from "@/lib/utils";

export const BalanceCards = ({
  leadId,
  size = "full",
}: {
  leadId: string;
  size: string;
}) => {
  const { onGetLeadBalance } = useLeadExpenseData(leadId);
  const { leadBalance, leadBalanceFetching } = onGetLeadBalance();

  const income = leadBalance?.income || 0;
  const expense = leadBalance?.expense || 0;
  const balance = income - expense;

  return (
    <div
      className={cn(
        "flex w-full flex-wrap gap-2 md:flex-nowrap",
        size == "sm" && "flex-col"
      )}
    >
      <SkeletonWrapper isLoading={leadBalanceFetching}>
        <StatCard
          value={expense}
          title="Expense"
          icon={
            <TrendingDown
              className={cn(
                "h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10",
                size == "sm" && "h-8 w-8"
              )}
            />
          }
          size={size}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={leadBalanceFetching}>
        <StatCard
          value={income}
          title="Income"
          icon={
            <TrendingUp
              className={cn(
                "h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10",
                size == "sm" && "h-8 w-8"
              )}
            />
          }
          size={size}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={leadBalanceFetching}>
        <StatCard
          value={balance}
          title="Balance"
          icon={
            <Wallet
              className={cn(
                "h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10",
                size == "sm" && "h-8 w-8"
              )}
            />
          }
          size={size}
        />
      </SkeletonWrapper>
    </div>
  );
};

const StatCard = ({
  value,
  title,
  icon,
  size = "full",
}: {
  icon: ReactNode;
  title: String;
  value: number;
  size: string;
}) => {
  return (
    <Card className="flex w-full items-center gap-2 p-2">
      {icon}
      <div
        className={cn(
          "flex flex-col items-start gap-0",
          size == "sm" && "flex-1 flex-row gap-2 items-center justify-end"
        )}
      >
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={USDollar.format}
          className={cn(size == "full" ? "text-2xl" : "text-sm")}
        />
      </div>
    </Card>
  );
};
