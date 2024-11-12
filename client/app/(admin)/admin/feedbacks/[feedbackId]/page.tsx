import React from "react";
import { currentRole } from "@/lib/auth";

import { EmptyCard } from "@/components/reusable/empty-card";
import Topbar from "./_components/top-bar";
import Unauthenticated from "@/components/global/unauthenticated";

import { getFeedbackById } from "@/actions/feedback/get-feedback-by-id";
import FeedbackInfo from "./_components/info";
import FeedbackFormDev from "./_components/feedback-dev-form";

const FeedBack = async ({ params }: { params: { feedbackId: string } }) => {
  const role = await currentRole();
  const { feedbackId } = params;
  if (role != "DEVELOPER") return <Unauthenticated />;

  const feedback = await getFeedbackById(feedbackId);

  if (!feedback) return <EmptyCard title="Feedback not found!" />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar feedback={feedback} />

      <section className="flex h-full overflow-auto">
        <FeedbackInfo feedback={feedback} />
        <div className="flex flex-col flex-1 bg-background p-2">
          <FeedbackFormDev feedback={feedback} />
        </div>
      </section>
    </div>
  );
};

export default FeedBack;
