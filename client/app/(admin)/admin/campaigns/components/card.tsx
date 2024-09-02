"use client";
import React, { Children } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, CircleDot, Dot, Folder } from "lucide-react";
import { useToggle } from "react-use";
import Link from "next/link";
import { Campaign } from "@prisma/client";
import { formatDistance } from "date-fns";
import { formatDate } from "@/formulas/dates";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  updated_at?: Date;
  link: string;
  active: boolean;
  children?: React.ReactNode;
  arrow?: boolean;
  defaultOpen?: boolean;
};

export const CampaignCard = ({
  name,
  updated_at,
  link,
  active,
  children,
  arrow = true,
}: Props) => {
  const [on, toggle] = useToggle(active);
  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="ghost"
          className="p-0.5 text-sm shrink-0 size-6"
          onClick={toggle}
        >
          {arrow ? (
            <ChevronDown
              size={16}
              className={cn(
                "-rotate-90 transition-transform",
                on && "rotate-0"
              )}
            />
          ) : (
            <CircleDot size={15} />
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "px-1.5 text-sm  h-[28px] justify-start overflow-hidden items-center",
            active && "bg-secondary"
          )}
          asChild
        >
          <Link href={link}>
            <span className="text-muted-foreground text-sm truncate">
              {name}
            </span>
          </Link>
        </Button>
      </div>

      {on && children}
    </>
  );
};
