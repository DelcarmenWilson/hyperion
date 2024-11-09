import { Suspense } from "react";
import { InboxIcon } from "lucide-react";
import { waitFor } from "@/lib/helper/waitfor";

import AlertError from "@/components/custom/alert-error";
import CreateScriptDialog from "./_components/create-script-dialog";
import NewPageLayout from "@/components/custom/layout/new-page-layout";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import ScriptCard from "./_components/script-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getScriptsForUser } from "@/actions/script/get-scripts-for-user";

const ScriptsPage = async () => {
  return (
    <NewPageLayout
      title="Scripts"
      subTitle="Manage Page Scripts"
      topMenu={<CreateScriptDialog />}
    >
      <Suspense fallback={<ScriptsSkeleton />}>
        <Scripts />
      </Suspense>
    </NewPageLayout>
  );
};

const ScriptsSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const Scripts = async () => {
  const scripts = await getScriptsForUser();
  if (!scripts) return <AlertError />;

  if (scripts.length == 0)
    return (
      <NewEmptyCard
        icon={InboxIcon}
        title="No script have been created yet"
        subTitle="Click the button below to create the first script"
        button={<CreateScriptDialog triggerText="Create the first Script" />}
      />
    );

  return (
    <div className="container grid grid-cols-1 gap-4">
      {scripts.map((script) => (
        <ScriptCard key={script.id} script={script} />
      ))}
    </div>
  );
};
export default ScriptsPage;
