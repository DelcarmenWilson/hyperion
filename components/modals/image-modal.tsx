"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";

type ImageModalProps = {
  title: string;
  type: string;
  id?: string;
  filePath: string;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (e: string) => void;
};
export const ImageModal = ({
  title,
  type,
  id,
  filePath,
  isOpen,
  onClose,
  onImageUpdate,
}: ImageModalProps) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };
  const onUpload = () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("filePath", filePath);
      formData.append("id", id as string);
      formData.append("type", type);
      axios.post("/api/upload/image", formData).then(() => {
        onImageUpdate(selectedImage);
        setSelectedImage("");
        setSelectedFile(undefined);
      });
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
      description="Previous image will be replaced"
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
            multiple={false}
            onChange={onFileChange}
          />
          <div className="min-w-40 max-w-md aspect-video rounded flex items-center justify-center border-2 border-dashed hover:bg-accent cursor-pointer">
            {selectedImage ? (
              <Image
                width={80}
                height={80}
                className="h-auto w-[250px]"
                src={selectedImage}
                alt="Profile Image"
              />
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center ">
                <ImageIcon className="w-8 h-8" />
                <span className=" text-lg text-muted-foreground">
                  Select Image
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
        {selectedFile && (
          <Button disabled={uploading} onClick={onUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        )}
      </div>
    </Modal>
  );
};
