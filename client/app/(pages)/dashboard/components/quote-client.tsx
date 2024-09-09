"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminQuoteUpdateActive,
  adminQuotesGetActive,
} from "@/actions/admin/quote";
import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/hooks/user-current-role";
import { Quote } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { toast } from "sonner";

export const QuoteClient = () => {
  const role = useCurrentRole();

  const queryClient = useQueryClient();
  const { data: quote, isFetching } = useQuery<Quote | null>({
    queryKey: ["pageQuote"],
    queryFn: () => adminQuotesGetActive(),
  });

  const { mutate } = useMutation({
    mutationFn: adminQuoteUpdateActive,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Quote Updated!!", {
          id: "update-active-quote",
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["pageQuote"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col relative p-4 rounded-xl border bg-primary/80 text-background shadow w-full">
      <SkeletonWrapper isLoading={isFetching}>
        {(role == "ADMIN" || role == "MASTER") && (
          <Button className="absolute top-2 right-2" onClick={() => mutate()}>
            NEW QUOTE
          </Button>
        )}
        <p className="font-medium italic p-4 text-3xl lg:text-5xl lg:p-20">
          &quot;{quote?.quote}&quot;
        </p>
        <div className="text-end font-bold text-2xl lg:text-3xl italic pr-3">
          - {quote?.author}
        </div>
      </SkeletonWrapper>
    </div>
  );
};
