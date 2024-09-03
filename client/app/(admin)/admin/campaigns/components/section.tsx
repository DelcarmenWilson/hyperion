import React from "react";
import { useToggle } from "react-use";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  hint: string;
  onNew?: () => void;
  children: React.ReactNode;
  header?: boolean;
};
export const CampaignSection = ({
  label,
  hint,
  onNew,
  header = true,
  children,
}: Props) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className={cn("flex flex-col px-2 gap-2", header ? "mt-3" : "mb-3")}>
      {header && (
        <div className="flex items-center group">
          <Button
            variant="ghost"
            className="p-0.5 text-sm shrink-0 size-6"
            onClick={toggle}
          >
            <ChevronDown
              size={16}
              className={cn(
                "-rotate-90 transition-transform",
                on && "rotate-0"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-1.5 text-sm  h-[28px] justify-start overflow-hidden items-center"
          >
            <span>{label}</span>
          </Button>

          {onNew && (
            <Button
              variant="ghost"
              size="icon"
              className=" ml-auto text-sm shrink-0 size-6"
              onClick={onNew}
            >
              <Plus size={16} />
            </Button>
          )}
        </div>
      )}
      {on && children}
    </div>
  );
};
