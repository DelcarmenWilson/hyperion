import React from "react";
import { currentUser } from "@/lib/auth";
import { getScriptById } from "@/actions/script/get-script-by-id";
import ScriptForm from "../_components/script-form";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import { X } from "lucide-react";
import { EmptyCard } from "@/components/reusable/empty-card";
import TopBar from "../_components/topbar/top-bar";
// const ScriptPage = async ({ params }: { params: { scriptId: string } }) => {
//   const user = currentUser();
//   const { scriptId } = params;
//   if (!user) return <div>unauthenticated</div>;

//   const script = await getScriptById(scriptId);

//   if (!script) return <div>script not found</div>;
//   return <ScriptForm script={script} />;
// };

const ScriptPage = async ({ params }: { params: { scriptId: string } }) => {
  const script = await getScriptById(params.scriptId);

  // if (!script) return <div className="flex-center w-full h-full">Script not found</div>;
  // if (!script) return <NewEmptyCard icon={X} title="Script not found" subTitle="Error trying to find a script"/>;
  if (!script) return <EmptyCard  title="Script not found" subTitle="Error trying to find a script"/>;
  return (
    <div>
      <TopBar title={script.name} description={script.description}/>
    </div>
  );
};

export default ScriptPage;
