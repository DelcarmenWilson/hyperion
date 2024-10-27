import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { JobClient } from "./components/client";

const JobsPage = () => {
  return (
    <PageLayoutAdmin title="Jobs" description="Manage Hyperion Jobs">
      <JobClient />
    </PageLayoutAdmin>
  );
};

export default JobsPage;
