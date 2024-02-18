import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { feedbackGetAll } from "@/actions/feedback";
import { columns } from "./components/columns";

const FeedbackPage = async () => {
  const feedbacks = await feedbackGetAll();
  return (
    <Card className="mt-2">
      <CardHeader>
        <Heading
          title={`User Feedback (${feedbacks.length})`}
          description="Manage feedback and bugs"
        />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={feedbacks} searchKey="headLine" />
      </CardContent>
    </Card>
  );
};

export default FeedbackPage;
