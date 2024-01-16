import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, HeartPulse, Users } from "lucide-react";
import { Heading } from "@/components/custom/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OverviewChart } from "./components/overview-chart";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

const DashboardPage = () => {
  const data = [
    {
      title: "Total Revenue",
      value: formatter.format(45231.89),
      icon: <DollarSign />,
    },
    {
      title: "Subscriptions",
      value: "+2350",
      icon: <Users />,
    },
    {
      title: "Sales",
      value: "+12,234",
      icon: <CreditCard />,
    },
    {
      title: "Active Now",
      value: "+573",
      icon: <HeartPulse />,
    },
  ];
  const chartData = getGraphRevenue();
  console.log(chartData);
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-7-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Overview of your organization"
        />
        <Separator />
        <div className="grid gap-4 grid-cols-4 mt-6">
          {data.map((d) => (
            <Overview
              key={d.title}
              title={d.title}
              value={d.value}
              icon={d.icon}
            />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardContent className="p-0">
                <OverviewChart data={chartData} />
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

interface OverviewProps {
  title: string;
  value: string;
  icon?: any;
}
const Overview = ({ title, value, icon: Icon }: OverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{Icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
