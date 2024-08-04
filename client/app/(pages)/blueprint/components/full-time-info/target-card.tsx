import React from "react";
import { BluePrintType } from "@/constants/blue-print";
import { USDollar } from "@/formulas/numbers";
import { cn } from "@/lib/utils";

type Props = {
  target: BluePrintType;
  size?: string;
  details?: boolean;
};
export const TargetCard = ({ target, size = "md", details = false }: Props) => {
  const { type: title, calls, appointments, premium } = target;
  return (
    <>
      <h4 className="text-center font-bold text-lg capitalize text-primary">
        {title}
      </h4>
      <div className={cn("space-y-2", size == "sm" ? "text-sm" : "")}>
        <p>
          {" "}
          <span>Calls: </span> <span>{calls || 0}</span>
        </p>
        <p>
          <span>{details ? "Appointments" : "Apps"}:</span>{" "}
          <span>{appointments || 0}</span>
        </p>
        <p>
          {" "}
          <span>Premium:</span> <span>{USDollar.format(premium || 0)}</span>
        </p>
      </div>
    </>
  );
};
