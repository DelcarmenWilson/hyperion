import React from "react";
import { MessageSquarePlus } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";
import { FeedbackForm } from "../components/shared/form";
import { DevFeedbackForm } from "./components/dev-feedback-form";

import { feedbackGetId } from "@/data/feedback";

const FeedBackIdPage = async ({ params }: { params: { id: string } }) => {
  const feedback = await feedbackGetId(params.id);
  if (!feedback) return null;
  return (
    <PageLayout
      title={`Feedback - ${feedback.page} | ${feedback.headLine} | Status:${feedback.status}`}
      icon={MessageSquarePlus}
    >
      <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <FeedbackForm feedback={feedback} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <DevFeedbackForm feedback={feedback} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FeedBackIdPage;
