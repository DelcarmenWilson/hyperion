import React from "react";
import { FeedBackIdClient } from "./components/client";
import { feedbackGetId } from "@/actions/feedback";

const FeedBackIdPage = async ({
  params,
}: {
  params: { feedbackId: string };
}) => {
  const feedback = await feedbackGetId(params.feedbackId);
  return <FeedBackIdClient feedback={feedback!} />;
};

export default FeedBackIdPage;
