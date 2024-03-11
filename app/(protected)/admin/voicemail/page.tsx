import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { RecordView } from "@/components/reusable/record-view";
import React from "react";

const VoicemailPage = () => {
  return (
    <PageLayoutAdmin title="Voicemail" description="Testing Voicemail">
      <RecordView />
    </PageLayoutAdmin>
  );
};

export default VoicemailPage;
