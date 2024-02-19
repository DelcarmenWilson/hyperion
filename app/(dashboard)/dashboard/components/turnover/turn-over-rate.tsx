import { DateRangePicker } from "@/components/custom/date-range-picker";
import { CardLayout } from "@/components/custom/card-layout";
import { PieChart } from "lucide-react";

const TurnOverRate = () => {
  return (
    <CardLayout title="Turn over Rate" icon={PieChart}>
      <p className="text-muted-foreground">Date Range</p>
      <DateRangePicker className="flex" />
    </CardLayout>
  );
};

export default TurnOverRate;
