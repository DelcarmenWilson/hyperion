import Editor from "../_components/editor";
import { EmptyCard } from "@/components/reusable/empty-card";
import { getScriptById } from "@/actions/script/get-script-by-id";

const ScriptPage = async ({ params }: { params: { scriptId: string } }) => {
  const script = await getScriptById(params.scriptId);

  if (!script)
    return (
      <EmptyCard
        title="Script not found"
        subTitle="Error trying to find a script"
      />
    );
  return <Editor script={script} />;
};

export default ScriptPage;
