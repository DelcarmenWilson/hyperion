import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { FeedbacksClient } from "./components/client";

import { feedbackGetAll } from "@/actions/feedback";

const FeedbackPage = async () => {
  const feedbacks = await feedbackGetAll();
  return (
    <PageLayoutAdmin
      title={`User Feedback (${feedbacks.length})`}
      description="Manage feedback and bugs"
    >
      <FeedbacksClient feedbacks={feedbacks} />
    </PageLayoutAdmin>
  );
};

export default FeedbackPage;
