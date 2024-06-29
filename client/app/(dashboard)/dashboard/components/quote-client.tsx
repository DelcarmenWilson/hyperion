"use client";
import { Button } from "@/components/ui/button";
import { generateTextCode } from "@/formulas/phone";
import { useCurrentRole } from "@/hooks/user-current-role";
import { Quote } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

type QuoteClientProps = {
  initQuote: Quote;
};
export const QuoteClient = ({ initQuote }: QuoteClientProps) => {
  const role = useCurrentRole();
  const [quote, setQuote] = useState(initQuote);
  if (!quote) return null;
  const onSetNewQuote = () => {
    // axios.post("/api/quote").then((response) => {
    //   const data = response.data;
    //   if (data.success) {
    //     setQuote(data.success);
    //   }
    // });
  };
  return (
    <div className="flex flex-col relative p-4 rounded-xl border bg-card text-card-foreground shadow w-full">
      {(role == "ADMIN" || role == "MASTER") && (
        <Button
          className="absolute top-2 right-2"
          variant="outlineprimary"
          onClick={onSetNewQuote}
        >
          NEW QUOTE
        </Button>
      )}
      <p className="font-medium italic p-4 text-3xl lg:text-5xl lg:p-20">
        &quot;{quote.quote}&quot;
      </p>
      <div className="text-end font-bold text-2xl lg:text-3xl text-primary italic pr-3">
        - {quote.author}
      </div>
    </div>
  );
};
