"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import { cn } from "@/lib/utils";

type ImageModalProps = {
  title: string;
  description?: string;
  type: string;
  id?: string;
  filePath: string;
  multi?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (e: string[], files: File[]) => void;
};
export const ImageModal = ({
  title,
  description = "Previous image will be replaced",
  type,
  id,
  filePath,
  multi = false,
  isOpen,
  onClose,
  onImageUpdate,
}: ImageModalProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>();
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

      setSelectedImages(sf);
      setSelectedFiles(fl);
    }
  };
  const onUpload = () => {
    setUploading(true);
    try {
      if (!selectedFiles?.length) return;
      if (id) {
        const formData = new FormData();
        // formData.append("image", selectedFiles[0]);
        for (let index = 0; index < selectedFiles.length; index++) {
          formData.append("image", selectedFiles[index]);
        }
        formData.append("filePath", filePath);
        formData.append("id", id as string);
        formData.append("type", type);
        axios.post("/api/upload/image", formData);
      }
      onImageUpdate(selectedImages, selectedFiles);
      setSelectedImages([]);
      setSelectedFiles(undefined);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
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
            {selectedImages.length ? (
              // <Image
              //   width={80}
              //   height={80}
              //   className="h-auto w-[250px]"
              //   src={selectedImage}
              //   alt="Profile Image"
              // />
              <div className={cn("grid-cols-4 gap-2", multi ? "grid " : "")}>
                {selectedImages.map((img, index) => (
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
        {selectedFiles && (
          <Button disabled={uploading} onClick={onUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        )}
      </div>
    </Modal>
  );
};
