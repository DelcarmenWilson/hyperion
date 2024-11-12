import React from "react";

import { EmptyCard } from "@/components/reusable/empty-card";
import FeedbackInfo from "./_components/info";
import { getFeedback } from "@/actions/feedback/get-feedback";

const FeedBackPage = async ({ params }: { params: { feedbackId: string } }) => {
  const { feedbackId } = params;

  const feedback = await getFeedback(feedbackId);

  if (!feedback) return <EmptyCard title="Feed back not found!" />;

  return <FeedbackInfo feedback={feedback} />;
};
export default FeedBackPage;
