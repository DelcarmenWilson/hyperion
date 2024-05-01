"use client";
import { useState } from "react";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { TempFolderList } from "./list";

type TempFolderClientProps = {
  folder: string;
  initImages: string[];
};
export const TempFolderClient = ({
  folder,
  initImages,
}: TempFolderClientProps) => {
  const [images] = useState(initImages);
  const [isList, setIsList] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center p-1">
        <h4 className="text-2xl font-semibold">{folder}</h4>
        <ListGridTopMenu
          text="Add Lead"
          isList={isList}
          setIsList={setIsList}
          setIsDrawerOpen={() => {}}
          showButton={false}
        />
      </div>
      <TempFolderList folder={folder} initImages={images!} />
    </>
  );
};
