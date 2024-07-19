import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { PageLayout } from "@/components/custom/layout/page-layout";

import { FeedbackForm } from "./components/shared/form";
import { FeedbackList } from "./components/list";

import { feedbacksGetAllByUserId } from "@/data/feedback";
const FeedbackPage = async () => {
  const user = await currentUser();
  const feedbacks = await feedbacksGetAllByUserId(user?.id as string);
  return (
    <PageLayout title="Feedback" icon={MessageSquarePlus}>
      <div className="flex-1 grid lg:grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <FeedbackForm feedback={null} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <FeedbackList initFeedbacks={feedbacks} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FeedbackPage;
