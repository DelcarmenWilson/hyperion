"use client";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Feed } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { feedsGetAllByAgentId, feedsUpdateAllUnread } from "@/actions/feed";

export const FeedsClient = () => {
  const { data: feeds, isFetching } = useQuery<Feed[]>({
    queryKey: ["agentFeeds"],
    queryFn: () => feedsGetAllByAgentId(),
  });

  const { mutate } = useMutation({
    mutationFn: feedsUpdateAllUnread,
    // onSuccess: (result) => {
    //   if (result.success) {
    //     toast.success(result.success, {
    //       id: "update-policy-info",
    //     });
    //   }
    // },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    mutate();
  }, []);
  return (
    <SkeletonWrapper isLoading={isFetching}>
      <DataTable
        columns={columns}
        data={feeds || []}
        headers
        placeHolder="Search Content"
      />
    </SkeletonWrapper>
  );
};
