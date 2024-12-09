import React, { ReactNode } from "react";
import { MessageSquarePlus, Plus } from "lucide-react";

import CreateFeedbackDialog from "./_components/create-feedback-dialog";
import FeedbackList from "@/app/(admin)/admin/feedbacks/_components/feedback-list";
import { PageLayout } from "@/components/custom/layout/page";

import { getFeedbacksForUser } from "@/actions/feedback/get-feedbacks-for-user";

const FeedbackLayout = async ({ children }: { children: ReactNode }) => {
  const feedbacks = await getFeedbacksForUser();
  return (
    <PageLayout title="Feedback" icon={MessageSquarePlus} scroll={false}>
      <div className="flex flex-1 h-full gap-2 overflow-hidden">
        <div className="relative flex flex-col w-[400px] overflow-hidden">
          <FeedbackList initFeedbacks={feedbacks} />
          <CreateFeedbackDialog />
        </div>
        <div className="flex-1 border-s h-full">{children}</div>
      </div>
    </PageLayout>
  );
};

export default FeedbackLayout;
