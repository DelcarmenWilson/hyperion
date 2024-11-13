"use client";
import { Shuffle } from "lucide-react";
import { useQuoteActions } from "@/hooks/admin/use-quote";

import { Button } from "@/components/ui/button";

const SetActiveQuoteBtn = () => {
  const { setActiveQuoteMutate, settingActiveQuote } = useQuoteActions();

  return (
    <Button
      variant="outline"
      disabled={settingActiveQuote}
      onClick={() => setActiveQuoteMutate()}
    >
      <Shuffle size={16} className="mr-2" /> Set Random Quote
    </Button>
  );
};

export default SetActiveQuoteBtn;
