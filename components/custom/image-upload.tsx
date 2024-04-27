"use client";
import { ChangeEvent } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  selectedImage: string;
  onImageUpdate: (files: File) => void;
};
export const ImageUpload = ({
  selectedImage,
  onImageUpdate,
}: ImageUploadProps) => {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      onImageUpdate(files[0]);
    }
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
        <div className="min-w-40 max-w-md aspect-video rounded flex items-center justify-center border-2 border-dashed hover:bg-accent cursor-pointer">
          {selectedImage ? (
            <Image
              width={100}
              height={100}
              className="h-[100px] w-[100px]"
              src={selectedImage}
              alt="Image to upload"
            />
          ) : (
            <div className="flex flex-col gap-2 justify-center items-center ">
              <ImageIcon size={26} />
              <span className="text-lg text-muted-foreground">
                Select Images
              </span>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
