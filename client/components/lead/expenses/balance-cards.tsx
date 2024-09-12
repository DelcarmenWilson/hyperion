"use client";
import React, { ReactNode } from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useLeadExpenseActions } from "@/hooks/lead/use-expense";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";

import { USDollar } from "@/formulas/numbers";

export const BalanceCards = () => {
  const { leadBalance, isFetchingLeadBalance } = useLeadExpenseActions();

  const income = leadBalance?.income || 0;
  const expense = leadBalance?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isFetchingLeadBalance}>
        <StatCard
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isFetchingLeadBalance}>
        <StatCard
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isFetchingLeadBalance}>
        <StatCard
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

const StatCard = ({
  value,
  title,
  icon,
}: {
  icon: ReactNode;
  title: String;
  value: number;
}) => {
  return (
    <Card className="flex w-full items-center gap-2 p-2">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={USDollar.format}
          className="text-2xl"
        />
      </div>
    </Card>
  );
};
