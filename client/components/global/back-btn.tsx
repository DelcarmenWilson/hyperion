"use client";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Button } from "../ui/button";
import TooltipWrapper from "../tooltip-wrapper";

const BackBtn = () => {
  const router = useRouter();
  return (
    <TooltipWrapper content="Back">
      <Button variant={"ghost"} size="icon" onClick={() => router.back()}>
        <ChevronLeftIcon size={20} />
      </Button>
    </TooltipWrapper>
  );
};

export default BackBtn;
