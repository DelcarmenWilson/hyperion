"use client";
import { useRef } from "react";
import { CardBox } from "@/components/custom/card/box";
import { useDashboardData } from "./hooks/use-dashboard";

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
          isFetching={isFetching}
        />
      ))}
    </div>
  );
};
