"use client";
import { useScriptData } from "@/hooks/admin/use-script";
import { ScriptForm } from "./components/form";

const ScriptsPage = () => {
  const { script } = useScriptData();
  if (!script) return null;

  return <ScriptForm script={script} />;
};
export default ScriptsPage;
