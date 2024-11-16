"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn, handleFileUpload } from "@/lib/utils";

import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";

type ImageModalProps = {
  title: string;
  description?: string;
  filePath: string;
  oldFile?: string;
  multi?: boolean;
  autoUpload?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (e: string[], files?: File[]) => void;
};
export const ImageModal = ({
  title,
  description = "Previous image will be replaced",
  filePath,
  oldFile,
  multi = false,
  autoUpload = true,
  isOpen,
  onClose,
  onImageUpdate,
}: ImageModalProps) => {
  const [files, setFiles] = useState<{
    images: string[];
    urls: File[] | undefined;
  }>({ images: [], urls: undefined });

  const [uploading, setUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const width = multi ? 80 : 250;
  const height = multi ? 80 : 150;

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      let sf: string[] = [],
        fl: File[] = [];
      for (let index = 0; index < files.length; index++) {
        sf.push(URL.createObjectURL(files[index]));
        fl.push(files[index]);
      }
      setFiles({ images: sf, urls: fl });
    }
  };
  const onUpload = async () => {
    if (autoUpload) {
      setUploading(true);
      try {
        if (!files.urls?.length) return;

        let urls: string[] = [];
        for (let i = 0; i < files.urls.length; i++) {
          const url = await handleFileUpload({
            newFile: files.urls[i],
            filePath,
            oldFile,
          });
          urls.push(url);
        }
        onImageUpdate(urls, files.urls);

        setFiles({ images: [], urls: undefined });
      } catch (error: any) {
        console.log(error.response?.data);
      }
      setUploading(false);
    } else {
      onImageUpdate(files.images, files.urls);
      setFiles({ images: [], urls: undefined });
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
      height="min-h-[400px]"
    >
      <div className="flex flex-col justify-center items-center">
        <label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            multiple={multi}
            onChange={onFileChange}
          />
          <div className="min-w-40 max-w-md aspect-video rounded flex items-center justify-center border-2 border-dashed hover:bg-accent cursor-pointer">
            {files.images.length ? (
              <div className={cn("grid-cols-4 gap-2", multi ? "grid " : "")}>
                {files.images.map((img, index) => (
                  <Image
                    key={index}
                    width={width}
                    height={height}
                    className={`h-[${height}px] w-[${width}px]`}
                    src={img}
                    alt={`Image${index}`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center ">
                <ImageIcon size={26} />
                <span className="text-lg text-muted-foreground">
                  Select Image{multi && "(s)"}
                </span>
              </div>
            )}
          </div>
        </label>
      </div>
      <div className="pt-6 flex gap-2 items-center justify-center">
        <Button disabled={uploading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        {files.urls && (
          <Button disabled={uploading} onClick={onUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        )}
      </div>
    </Modal>
  );
};
