import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type MeetingCardProps = {
  className?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  handleClick?: () => void;
};

const MeetingCard = ({
  className,
  icon: Icon,
  title,
  description,
  handleClick,
}: MeetingCardProps) => {
  return (
    <section
      className={cn(
        "flex flex-col  justify-between w-full rounded-[10px] opacity-80 hover:opacity-100 cursor-pointer  p-4 ",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center glassmorphism size-12 rounded-[10px]">
        <Icon size={27} />
      </div>

      <div className="flex flex-col gap-2 py-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </section>
  );
};

export default MeetingCard;
