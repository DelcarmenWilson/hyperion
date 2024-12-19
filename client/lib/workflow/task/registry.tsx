import { TaskType } from "@/types/workflow/task";
import { WorkflowTask } from "@/types/workflow/workflow";

import { ExtractTextFromElementTask } from "./extact-text-from-element";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHtmlTask } from "./page-to-html";
import { TestLeadTask } from "./facebook";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};
export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  TEST_LEAD_TASK: TestLeadTask,
};
