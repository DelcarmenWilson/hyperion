"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const TempFolderTopMenu = () => {
  const searchParams = useSearchParams();
  const initFolder = searchParams.get("folder");
  const [folder, setFolder] = useState(initFolder || "temp");
  const router = useRouter();

  const onUpdate = () => {
    router.push(`/admin/temp-folder?folder=${folder}`);
    router.refresh();
  };

  return (
    <div className="w-full col-span-3 flex flex-col lg:flex-row justify-end items-end gap-2">
      <Input
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        placeholder="Search Folders"
      />
      <Button onClick={onUpdate}>Update</Button>
    </div>
  );
};
