"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { TempFolderList } from "./list";

type TempFolderClientProps = {
  initImages: string[];
};
export const TempFolderClient = ({ initImages }: TempFolderClientProps) => {
  const [images, setImages] = useState(initImages);
  const [isList, setIsList] = useState(false);

  // useEffect(() => {
  //   const onTempfolderDeleted = (id: string) => {
  //     setImages((leads) => {
  //       if (!leads) return leads;
  //       return leads.filter((e) => e.id !== id);
  //     });
  //   };

  //   adminEmitter.on("tempfolderDeleted", (id) => onTempfolderDeleted(id));

  //   return () => {
  //     adminEmitter.on("tempfolderDeleted", (id) => onTempfolderDeleted(id));}
  // }, []);

  return (
    <>
      <div className="flex justify-between items-center p-1">
        <h4 className="text-2xl font-semibold">Tempfolders</h4>
        <ListGridTopMenu
          text="Add Lead"
          isList={isList}
          setIsList={setIsList}
          setIsDrawerOpen={() => {}}
          showButton={false}
        />
      </div>
      <TempFolderList initImages={images!} />
    </>
  );
};
