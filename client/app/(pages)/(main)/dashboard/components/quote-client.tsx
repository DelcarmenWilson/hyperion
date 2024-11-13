"use client";

import { QuoteIcon } from "lucide-react";
import { useQuoteActions, useQuoteData } from "@/hooks/admin/use-quote";
import { useCurrentRole } from "@/hooks/user/use-current";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { UPPERADMINS } from "@/constants/user";

export const QuoteClient = () => {
  const role = useCurrentRole();
  const { onGetActiveQuote } = useQuoteData();
  const { activeQuote, fetchingActiveQuote, loadingActiveQuote } =
    onGetActiveQuote();
  const { setActiveQuoteMutate, settingActiveQuote } = useQuoteActions();

  return (
    <div className="p-2 rounded-xl border bg-gradient w-full">
      <div className="relative flex flex-col rounded-xl  bg-background text-foreground shadow w-full group">
        <SkeletonWrapper isLoading={fetchingActiveQuote}>
          {UPPERADMINS.includes(role!) && (
            <Button
              variant="outlineprimary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500"
              disabled={settingActiveQuote}
              onClick={() => setActiveQuoteMutate()}
            >
              NEW QUOTE
            </Button>
          )}
          <p className=" inline-block font-medium italic p-4 text-3xl lg:text-5xl lg:p-20">
            <QuoteIcon
              size={40}
              className="inline stroke-secondary-foreground rotate-180 -mt-4"
            />
            {activeQuote?.quote}
            <QuoteIcon
              size={40}
              className="inline stroke-secondary-foreground"
            />
          </p>
          <div className="text-end font-bold text-2xl lg:text-3xl italic pr-3">
            - {activeQuote?.author}
          </div>
        </SkeletonWrapper>
      </div>
    </div>
  );
};
