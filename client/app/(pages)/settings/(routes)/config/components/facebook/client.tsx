"use client";
import { useFacebookData } from "../../hooks/use-config";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { FacebookForm } from "./form";

export const FacebookClient = () => {
  const { adAccount, isFetchingAdAccount, loading, onAdAccountSubmit } =
    useFacebookData();
  return (
    <SkeletonWrapper isLoading={isFetchingAdAccount}>
      <FacebookForm
        adAccount={adAccount}
        loading={loading}
        onSubmit={onAdAccountSubmit}
      />
    </SkeletonWrapper>
  );
};
