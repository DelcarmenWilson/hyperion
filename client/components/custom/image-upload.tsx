"use client";
import { ChangeEvent, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

import Loader from "../reusable/loader";
import { Button } from "../ui/button";

type ImageUploadProps = {
  selectedImage: string;
  onImageUpdate: (image: File, url: string) => void;
  onImageRemove: () => void;
};
export const ImageUpload = ({
  selectedImage,
  onImageUpdate,
  onImageRemove,
}: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    onImageUpdate(file, url);

    setLoading(false);
  };
  const onImageRemoved = () => {
    setLoading(true);
    onImageRemove();
    setLoading(false);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          onChange={onFileChange}
        />
        <div className="flex-center min-w-40 max-w-md aspect-video rounded  border-2 border-dashed hover:bg-accent cursor-pointer">
          {loading ? (
            <Loader />
          ) : (
            <>
              {selectedImage ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="absolute top-0 right-0"
                    type="button"
                    onClick={onImageRemoved}
                  >
                    <X size={16} />
                  </Button>
                  <Image
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px]"
                    src={selectedImage}
                    alt="Image to upload"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 justify-center items-center ">
                  <ImageIcon size={26} />
                  <span className="text-lg text-muted-foreground">
                    Select Images
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </label>
    </div>
  );
};
