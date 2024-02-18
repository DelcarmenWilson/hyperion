"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type TopMenuProps = {
  nextPrev: { prev: string | null; next: string | null } | null;
};
export const TopMenu = ({ nextPrev }: TopMenuProps) => {
  const router = useRouter();
  return (
    <>
      <Button
        variant="outlineprimary"
        size="sm"
        onClick={() => router.push("/leads")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        GO BACK
      </Button>
      <Button
        disabled={!nextPrev?.prev}
        size="sm"
        onClick={() => router.push(`/leads/${nextPrev?.prev}`)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        PREV LEAD
      </Button>
      <Button
        disabled={!nextPrev?.next}
        size="sm"
        onClick={() => router.push(`/leads/${nextPrev?.next}`)}
      >
        NEXT LEAD
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
};
