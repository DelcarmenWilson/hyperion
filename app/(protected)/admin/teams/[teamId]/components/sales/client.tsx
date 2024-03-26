"use client";
import React from "react";
import { format } from "date-fns";

import { Sales } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIntials } from "@/formulas/text";
import { USDollar } from "@/formulas/numbers";

type RecentSalesProps = {
  sales: Sales[];
};
export const RecentSales = ({ sales }: RecentSalesProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="grid grid-cols-2 lg:grid-cols-4 items-center text-sm font-medium leading-none"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={sale.user.image as string} alt="Avatar" />
                <AvatarFallback>
                  {getIntials(sale.user.firstName, sale.user.lastName)}
                </AvatarFallback>
              </Avatar>
              <p>{sale.firstName}</p>
              <p>{format(sale.updatedAt, "MM-dd-yyy")}</p>
              <p className="font-medium text-end">
                +{USDollar.format(sale.saleAmount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
