import React, { Suspense } from "react";
import { MessageSquarePlus } from "lucide-react";

import AlertError from "@/components/custom/alert-error";
import FeedbackList from "./_components/feedback-list";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import NewPageLayout from "@/components/custom/layout/new-page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeedbacks } from "@/actions/feedback/get-feedbacks";
import { currentRole } from "@/lib/auth";
import Unauthenticated from "@/components/global/unauthenticated";

const FeedBackPage = () => {
  return (
    <NewPageLayout title="Feedback" subTitle="Manage All Feedbacks">
      <Suspense fallback={<FeedbacksSkeleton />}>
        <Feedbacks />
      </Suspense>
    </NewPageLayout>
  );
};

const FeedbacksSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const Feedbacks = async () => {
  const role = await currentRole();
if (role != "DEVELOPER") return <Unauthenticated/>

  const feedbacks = await getFeedbacks();
  if (!feedbacks) return <AlertError />;
  if (feedbacks.length === 0)
    return <NewEmptyCard title="No feedbacks found" icon={MessageSquarePlus} />;

  return <FeedbackList initFeedbacks={feedbacks} admin />;
};

export default FeedBackPage;
