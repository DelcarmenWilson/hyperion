"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LeadPrevNext } from "@/types";

type PrevNextMenuProps = {
  href: string; //exclude the slash
  prevNext: LeadPrevNext;
  btnText: string;
};
export const PrevNextMenu = ({
  href,
  prevNext,
  btnText,
}: PrevNextMenuProps) => {
  const router = useRouter();
  if (!prevNext) return null;
  const { prev, next } = prevNext;
  const prevName = prev
    ? `${prev?.name} ${prev?.state} - ${prev?.age}`
    : `PREV ${btnText.toUpperCase()}`;
  const nextName = next
    ? `${next?.name} ${next?.state} - ${next?.age}`
    : `NEXT ${btnText.toUpperCase()}`;
  return (
    <div className="flex justify-end gap-2 w-full">
      <Button
        className="items-center gap-2"
        variant="outlineprimary"
        size="sm"
        onClick={() => router.push(`/${href}`)}
      >
        <ArrowLeft size={16} />
        GO BACK
      </Button>
      <Button
        className="items-center gap-2"
        disabled={!prev}
        size="sm"
        onClick={() => router.push(`/${href}/${prev?.id}`)}
      >
        <ChevronLeft size={16} />
        {prevName}
      </Button>
      <Button
        className="items-center gap-2"
        disabled={!next}
        size="sm"
        onClick={() => router.push(`/${href}/${next?.id}`)}
      >
        {nextName}
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
