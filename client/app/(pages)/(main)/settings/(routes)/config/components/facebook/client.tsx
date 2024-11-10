"use client";
import { useFacebookData } from "../../hooks/use-config";

import { FacebookForm } from "./form";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const FacebookClient = () => {
  const { adAccount, isFetchingAdAccount } = useFacebookData();
  return (
    <SkeletonWrapper isLoading={isFetchingAdAccount}>
      <FacebookForm adAccount={adAccount} />
    </SkeletonWrapper>
  );
};
