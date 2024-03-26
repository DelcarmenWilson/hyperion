import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type IconLinkProps = {
  title: string;
  href: string;
  active: boolean;
  icon: LucideIcon;
};

export const IconLink = ({
  title,
  href,
  active,
  icon: Icon,
}: IconLinkProps) => {
  const { collapsed } = useSidebar((state) => state);
  return (
    <Link href={href}>
      <Button
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn(
          "w-full flex items-center group mb-2",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <Icon size={16} className="group-hover:animate-spin" />
        {!collapsed && <span className="ml-2">{title}</span>}
      </Button>
    </Link>
  );
};

export const IconLinkSkeleton = () => {
  return <Skeleton className="min-h-[32px] w-full rounded-sm mb-2" />;
};
