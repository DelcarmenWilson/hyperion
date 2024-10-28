"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { PrevNext } from "@/types/general";

import { Button } from "@/components/ui/button";

type PrevNextMenuProps = {
  href: string; //exclude the slash
  prevNext: PrevNext;
  btnText: string;
};
export const PrevNextMenu = ({
  href,
  prevNext,
  btnText,
}: PrevNextMenuProps) => {
  const router = useRouter();
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
        disabled={!prevNext?.prev}
        size="sm"
        onClick={() => router.push(`/${href}/${prevNext?.prev}`)}
      >
        <ChevronLeft size={16} />
        PREV {btnText.toUpperCase()}
      </Button>
      <Button
        className="items-center gap-2"
        disabled={!prevNext?.next}
        size="sm"
        onClick={() => router.push(`/${href}/${prevNext?.next}`)}
      >
        NEXT {btnText.toUpperCase()}
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
