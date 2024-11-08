import React from "react";
import { currentUser } from "@/lib/auth";
import { getScriptById } from "@/actions/script/get-script-by-id";
import ScriptForm from "../_components/script-form";
const ScriptPage = async ({ params }: { params: { scriptId: string } }) => {
  const user = currentUser();
  const { scriptId } = params;
  if (!user) return <div>unauthenticated</div>;

  const script = await getScriptById(scriptId);

  if (!script) return <div>script not found</div>;
  return <ScriptForm script={script} />;
};

export default ScriptPage;
