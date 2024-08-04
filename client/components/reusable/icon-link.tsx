import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
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
  return (
    
      <Button
        variant={active ? "default" : "sidebar"}
        size="sm"
        className="group mb-2"
      >
        <Link href={href} className={"w-full flex items-center"}>
        <Icon size={16} className="group-hover:animate-spin" />
        <span className="ml-2">{title}</span>
        </Link>
      </Button>
    
  );
};

export const IconLinkSkeleton = () => {
  return <Skeleton className="min-h-[32px] w-full rounded-sm mb-2" />;
};
