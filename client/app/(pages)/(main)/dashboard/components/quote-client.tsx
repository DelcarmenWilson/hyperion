"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminQuoteUpdateActive,
  adminQuotesGetActive,
} from "@/actions/admin/quote";
import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/hooks/user/use-current";
import { Quote } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { toast } from "sonner";
import { UPPERADMINS } from "@/constants/user";

export const QuoteClient = () => {
  const role = useCurrentRole();

  const queryClient = useQueryClient();
  const { data: quote, isFetching } = useQuery<Quote | null>({
    queryKey: ["page-quote"],
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
        queryKey: ["page-quote"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="p-2 rounded-xl border bg-gradient w-full">
      <div className="relative flex flex-col rounded-xl  bg-background text-foreground shadow w-full">
        <SkeletonWrapper isLoading={isFetching}>
          {UPPERADMINS.includes(role!) && (
            <Button
              variant="outlineprimary"
              className="absolute top-2 right-2"
              onClick={() => mutate()}
            >
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
    </div>
  );
};
