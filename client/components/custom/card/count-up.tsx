"use client";
import CountUp from "react-countup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardCountUpProps = {
  title: string;
  value: string;
  icon?: any;
};

export const CardCountUp = ({ title, value, icon: Icon }: CardCountUpProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{Icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {parseInt(value) > 0 ? (
            <CountUp start={0} end={parseInt(value)} duration={3} />
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
};
