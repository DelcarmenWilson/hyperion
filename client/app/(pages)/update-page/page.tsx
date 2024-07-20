import React from "react";
import { pageUpdatesGetAll } from "@/actions/admin/page-update";

const UpdatePage = async () => {
  const updates = await pageUpdatesGetAll();

  return <div>{JSON.stringify(updates)}</div>;
};

export default UpdatePage;
