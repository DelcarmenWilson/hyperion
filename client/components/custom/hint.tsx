import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

const Hint = ({ label, children, side, align }: Props) => {
  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        // className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary to-primary"
        side={side}
        align={align}
      >
        <p className="font-medium text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
