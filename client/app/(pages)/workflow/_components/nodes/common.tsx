import { TaskParamType } from "@/types/workflow/task";

export const colorForHandle: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
  SELECT: "!bg-sky-400",
  SELECT_CARRIER: "!bg-sky-400",
  SELECT_PIPELINE: "!bg-sky-400",
};
