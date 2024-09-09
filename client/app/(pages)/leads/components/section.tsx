import React from "react";
import { ChevronDown, FilePenLine } from "lucide-react";
import { useToggle } from "react-use";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Hint from "@/components/custom/hint";

type Props = {
  label: string;
  hint: string;
  onEdit?: () => void;
  children: React.ReactNode;
  header?: boolean;
};
export const LeadSection = ({
  label,
  hint,
  onEdit,
  header = true,
  children,
}: Props) => {
  const [on, toggle] = useToggle(true);
  return (
    <div
      className={cn("group flex flex-col px-2 gap-2", header ? "mt-3" : "mb-3")}
    >
      {header && (
        <div className="flex items-center bg-primary/25">
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

          <Hint hint={hint}>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 px-1.5 text-sm  h-[28px] justify-start overflow-hidden items-center"
              onClick={toggle}
            >
              <span>{label}</span>
            </Button>
          </Hint>

          {onEdit && (
            <Button
              variant="outlineprimary"
              size="icon"
              className="ml-auto text-sm shrink-0 size-6 opacity-0 group-hover:opacity-100"
              onClick={onEdit}
            >
              <FilePenLine size={16} />
            </Button>
          )}
        </div>
      )}
      <div className="pl-3">{on && children}</div>
    </div>
  );
};
