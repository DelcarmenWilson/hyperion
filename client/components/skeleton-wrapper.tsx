import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
};
const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
  fullHeight = false,
}: Props) => {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full", fullHeight && "h-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
