"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sales } from "@/types";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIntials } from "@/formulas/text";
import { format } from "date-fns";
import { USDollar } from "@/formulas/numbers";

type RecentSalesProps = {
  sales: Sales[];
};
export const RecentSales = ({ sales }: RecentSalesProps) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>RecentSales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale) => (
            <div key={sale.id} className="grid grid-cols-4 items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={sale.user.image as string} alt="Avatar" />
                <AvatarFallback>
                  {getIntials(sale.user.firstName, sale.user.lastName)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">
                {sale.firstName}
              </p>
              <div className="text-sm font-medium leading-none">
                {format(sale.updatedAt, "MM-dd-yyy")}
              </div>
              <div className="font-medium">
                +{USDollar.format(parseInt(sale.saleAmount!))}
              </div>
            </div>
          ))}
        </div>
        {/* <DataTable columns={columns} data={sales} searchKey="lead" /> */}
      </CardContent>
    </Card>
  );
};
