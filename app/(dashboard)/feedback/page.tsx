import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { currentUser } from "@/lib/auth";

import { PageLayout } from "@/components/custom/page-layout";

import { FeedbackForm } from "./components/shared/form";
import { FeedbackList } from "./components/list";

import { feedbackGetAllByUserId } from "@/actions/feedback";
const FeedbackPage = async () => {
  const user = await currentUser();
  const feedbacks = await feedbackGetAllByUserId(user?.id as string);
  return (
    <PageLayout title="Feedback" icon={MessageSquarePlus}>
      <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <FeedbackForm feedback={null} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <FeedbackList feedbacks={feedbacks} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FeedbackPage;
