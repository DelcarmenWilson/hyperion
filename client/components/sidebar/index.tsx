"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { IconLinkSkeleton } from "../reusable/icon-link";
import MenuOptions from "./menu-option";

export const SideBar = ({ main = false }: { main?: boolean }) => {
  return <MenuOptions main={main} defaultOpen />;
};

export const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] h-full bg-background border-r z-50 py-2 transition ease-in-out">
      <div className="flex items-center justify-center gap-2 p-2 cursor-pointer">
        <Skeleton className="min-h-[60px] min-w-[60px] " />
        {/* <span className="transition font-semibold text-2xl delay-1000">
          Hyperion
        </span> */}
      </div>
      <Separator />
      <div className="p-2 flex-1">
        {[...Array(5)].map((_, i) => (
          <IconLinkSkeleton key={i} />
        ))}
      </div>

      <div className="flex flex-col mt-auto items-center space-y-4">
        <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
        <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
      </div>
    </aside>
  );
};
