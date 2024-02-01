import { DateRangePicker } from "@/components/custom/date-range-picker";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PieChart } from "lucide-react";

const TurnOverRate = () => {
  return (
    <Card className="relative  overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Turn over Rate
          </CardTitle>
        </div>
      </div>

      <CardContent className="items-center space-y-0 pb-2">
        <div>
          <p className="text-muted-foreground">Date Range</p>
          <DateRangePicker />
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnOverRate;
