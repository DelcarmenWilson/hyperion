import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Quote } from "@prisma/client";
import { CreateQuoteSchemaType } from "@/schemas/admin";

import { createQuote } from "@/actions/admin/quote/create-quote";
import { setActiveQuote } from "@/actions/admin/quote/set-active-quote";
import { getActiveQuote } from "@/actions/admin/quote/get-active-quote";
import { useInvalidate } from "../use-invalidate";

export const useQuoteData = () => {
  // GET ACTIVE QUOTES
  const onGetActiveQuote = () => {
    const {
      data: activeQuote,
      isFetching: fetchingActiveQuote,
      isLoading: loadingActiveQuote,
    } = useQuery<Quote | null>({
      queryFn: () => getActiveQuote(),
      queryKey: ["page-quote"],
    });
    return { activeQuote, fetchingActiveQuote, loadingActiveQuote };
  };

  return { onGetActiveQuote };
};

export const useQuoteActions = (cb?: () => void) => {
  const { invalidate } = useInvalidate();
  //CREATING QUOTE
  const { mutate: createQuoteMutate, isPending: creatingQuote } = useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      toast.success("Quote created", { id: "create-quote" });
      if (cb) cb();
    },
    onError: () =>
      toast.error("Failed to create quote", { id: "create-quote" }),
  });
  const onCreateQuote = useCallback(
    (values: CreateQuoteSchemaType) => {
      toast.loading("Creating workflow", { id: "create-quote" });
      createQuoteMutate(values);
    },
    [createQuoteMutate]
  );
  //SET ACTIVE QUOTE
  const { mutate: setActiveQuoteMutate, isPending: settingActiveQuote } =
    useMutation({
      mutationFn: setActiveQuote,
      onSuccess: () => {
        toast.success("New quote has been selected!", {
          id: "set-active-quote",
        });
        invalidate("page-quote");
      },
      onError: () =>
        toast.error("Failed to selete quote", { id: "set-active-quote" }),
    });

  return {
    onCreateQuote,
    creatingQuote,
    setActiveQuoteMutate,
    settingActiveQuote,
  };
};
