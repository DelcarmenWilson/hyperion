"use client";
import { adminEmitter } from "@/lib/event-emmiter";
import { cn } from "@/lib/utils";
import { TempFolderCard } from "./card";
import { useEffect, useState } from "react";
import { EmptyCard } from "@/components/reusable/empty-card";
import axios from "axios";
import { toast } from "sonner";
//TODO - need to make this use the aws3 bucket, or possibly remove this entirely
type TempFolderListProps = {
  folder: string;
  initImages: string[];
  size?: string;
};
export const TempFolderList = ({
  folder,
  initImages,
  size = "full",
}: TempFolderListProps) => {
  const [images, setImages] = useState(initImages);
  useEffect(() => {
    setImages(initImages);
    // const onSetImages = (id: string) => {
    //   axios
    //     .put("/api/upload/image", { oldFile: `/assets/${folder}/${id}` })
    //     .then((response) => {
    //       const data = response.data;
    //       if (data.success) {
    //         setImages((images) => images.filter((e) => e != id));
    //         toast.success(data.success);
    //       }
    //       if (data.error) {
    //         toast.error(data.error);
    //       }
    //     });
    // };

    // adminEmitter.on("tempImageDeleted", onSetImages);
  }, [initImages]);
  return (
    <>
      {images.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-6"
          )}
        >
          {images.map((image, i) => (
            <TempFolderCard key={i} folder={folder} image={image} />
          ))}
        </div>
      ) : (
        <EmptyCard title="No images found" />
      )}
    </>
  );
};
