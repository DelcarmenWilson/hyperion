"use client";
import { MessageSquarePlus } from "lucide-react";

import { Feedback, User } from "@prisma/client";
import { FeedbackForm } from "../../components/shared/form";
import { PageLayout } from "@/components/custom/page-layout";
import { DevFeedbackForm } from "./dev-feedback-form";

type FeedBackIdClientProps = {
  feedback: Feedback & {
    user: User;
  };
};
export const FeedBackIdClient = ({ feedback }: FeedBackIdClientProps) => {
  return (
    <PageLayout
      title={`Feedback - ${feedback.page} | ${feedback.headLine} | status:${feedback.status}`}
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
