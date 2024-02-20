import { DataTable } from "@/components/tables/data-table";
import { feedbackGetAll } from "@/actions/feedback";
import { columns } from "./components/columns";
import { PageLayoutAdmin } from "../../../../components/custom/page-layout-admin";

const FeedbackPage = async () => {
  const feedbacks = await feedbackGetAll();
  return (
    <PageLayoutAdmin
      title={`User Feedback (${feedbacks.length})`}
      description="Manage feedback and bugs"
    >
      <DataTable columns={columns} data={feedbacks} searchKey="headLine" />
    </PageLayoutAdmin>
  );
};

export default FeedbackPage;
