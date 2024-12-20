import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

type Props = {
  text: string;
  viewBox?: string;
  x?: string;
  y?: string;
  dy?: string;
  textAnchor?: string;
};
export const TextAnimation = ({
  text,
  viewBox = "0 0 500 160",
  x = "50%",
  y = "60%",
  dy = ".32rem",
  textAnchor = "middle",
}: Props) => {
  return (
    <svg className={cn("svg-logo", font.className)} viewBox={viewBox}>
      <text
        x={x}
        y={y}
        alignmentBaseline="middle"
        textAnchor={textAnchor}
        className="capitalize"
      >
        {text}
      </text>
    </svg>
  );
};
