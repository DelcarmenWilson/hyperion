import { Feedback } from "@prisma/client";

export enum FeedbackStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type ShortFeedback = Feedback & {
  user: {
    id: string;
    firstName: string;
  };
};
