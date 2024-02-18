import React from "react";
import { FeedbacksClient } from "./components/client";
import { feedbackGetAllByUserId } from "@/actions/feedback";
import { currentUser } from "@/lib/auth";

const FeedbackPage = async () => {
  const user = await currentUser();
  const feedbacks = await feedbackGetAllByUserId(user?.id as string);
  return (
    <>
      <FeedbacksClient feedbacks={feedbacks} />
    </>
  );
};

export default FeedbackPage;
