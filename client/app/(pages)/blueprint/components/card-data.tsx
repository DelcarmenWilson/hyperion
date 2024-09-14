import CountUp from "react-countup";
import { Progress } from "@/components/ui/progress";

type CardDataProps = {
  label: string;
  data: number;
  target: number;
  dollar?: boolean;
};

export const CardData = ({ label, data, target, dollar }: CardDataProps) => {
  const css =
    data == 0
      ? "text-destructive"
      : data > target
      ? "text-emerald-500"
      : "text-foreground";
  return (
    <div className="flex gap-2 flex-col">
      <p className="font-semibold">{label}:</p>
      <p className="text-center text-2xl font-semibold">
        <span className={css}>
          {dollar && "$"}
          <CountUp start={0} end={data} duration={3} />
        </span>
        {" / "}
        <span className="text-primary">
          {dollar && "$"}
          {target}
        </span>
      </p>
    </div>
  );
};

type BarProps = {
  label: string;
  data: number;
  target: number;
  dollar?: boolean;
  percentage: number;
};
export const Bar = ({ label, data, target, dollar, percentage }: BarProps) => {
  const css =
    data == 0
      ? "text-destructive"
      : data > target
      ? "text-emerald-500"
      : "text-foreground";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between group">
        <span className="flex items-center text-gray-400">
          {label}

          <span className="ml-2 text-xs text-muted-foreground">
            ({percentage.toFixed(0)}%)
          </span>
        </span>
        <div className="flex gap-1 items-center">
          <span className="text-sm text-gray-400">
            {dollar && "$"}
            <CountUp start={0} end={data} duration={3} /> / {dollar && "$"}
            {target}
          </span>
        </div>
      </div>
      <Progress value={percentage} indicator={css} />
    </div>
  );
};
