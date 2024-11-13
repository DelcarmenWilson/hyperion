"use client";
import { LucideIcon } from "lucide-react";

import { useDashboardData } from "./hooks/use-dashboard";

import Link from "next/link";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const DashBoardClient = () => {
  const { dataCard, isFetching } = useDashboardData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:grid-cols-2">
      {dataCard.map((data) => (
        <CardBox
          key={data.title}
          icon={data.icon}
          title={data.title}
          value={data.value}
          href={data.href}
          hrefTitle={data.hrefTitle}
          loading={isFetching}
        />
      ))}
    </div>
  );
};

type CardBoxProps = {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
  loading: boolean;
};
const CardBox = ({
  icon: Icon,
  title,
  value,
  href,
  hrefTitle,
  loading = false,
}: CardBoxProps) => {
  return (
    <Card className="relative overflow-hidden w-full group">
      <Icon size={60} className="absolute bottom-2 -right-2 stroke-secondary" />
      <SkeletonWrapper isLoading={loading}>
        <div className="flex justify-between items-center mb-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Icon
              size={20}
              className="stroke-primary group-hover:animate-bounce"
            />
          </div>
          <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
            <span className="text-sm text-muted-foreground block">{title}</span>
            <span className="text-lg text-primary font-medium">{value}</span>
          </CardTitle>
        </div>

        <Separator />
        <CardContent className="flex p-2">
          <Link
            href={href}
            className="text-primary flex items-center hover:font-semibold gap-1"
          >
            <Icon size={16} />
            <span>{hrefTitle}</span>
          </Link>
        </CardContent>
      </SkeletonWrapper>
    </Card>
  );
};
