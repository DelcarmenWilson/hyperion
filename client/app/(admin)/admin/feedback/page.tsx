import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { FeedbacksClient } from "./components/client";

import { feedbacksGetAll } from "@/data/feedback";

const FeedbackPage = async () => {
  const feedbacks = await feedbacksGetAll();
  return (
    <PageLayoutAdmin
      title={`User Feedback (${
        feedbacks.filter((e) => e.status == "New").length
      })`}
      description="Manage feedback and bugs"
    >
      <FeedbacksClient feedbacks={feedbacks} />
    </PageLayoutAdmin>
  );
};

export default FeedbackPage;
