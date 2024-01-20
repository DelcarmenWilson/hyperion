import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";

interface IconLinkProps {
  title: string;
  href: string;
  active: boolean;
  icon: LucideIcon;
}

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
          "w-full flex items-center  mb-2",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <Icon className="w-4 h-4" />
        {!collapsed && <span className="ml-2">{title}</span>}
      </Button>
    </Link>
  );
};
