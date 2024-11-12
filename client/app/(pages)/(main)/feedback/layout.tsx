import React, { ReactNode } from "react";
import { MessageSquarePlus } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";
import FeedbackList from "@/app/(admin)/admin/feedbacks/_components/feedback-list";

import { getFeedbacksForUser } from "@/actions/feedback/get-feedbacks-for-user";
import CreateFeedbackDialog from "./_components/create-feedback-dialog";

const FeedbackLayout = async ({ children }: { children: ReactNode }) => {
  const feedbacks = await getFeedbacksForUser();
  return (
    <PageLayout title="Feedback" icon={MessageSquarePlus}>
      <div className="flex flex-1 h-full gap-2 overflow-hidden">
        <div className="flex flex-col w-[400px] overflow-hidden">
          <FeedbackList initFeedbacks={feedbacks} />
          <div className="mt-auto text-end">
            <CreateFeedbackDialog triggerText="Create Feedback" />
          </div>
        </div>
        <div className="flex-1 border-s h-full">{children}</div>
      </div>
    </PageLayout>
  );
};

export default FeedbackLayout;
