import CountUp from "react-countup";

type CardDataProps = {
  label: string;
  data: number;
  target: number;
  dollar?: boolean;
};

export const CardData = ({ label, data, target, dollar }: CardDataProps) => {
  return (
    <div className="flex gap-2 flex-col">
      <p className="font-semibold">{label}:</p>
      <p className="text-center text-2xl font-semibold">
        <span
          className={
            data == 0
              ? "text-destructive"
              : data > target
              ? "text-emerald-500"
              : "text-foreground"
          }
        >
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
