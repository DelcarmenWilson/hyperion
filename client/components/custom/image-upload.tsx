"use client";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";

import Loader from "../reusable/loader";
import { Button } from "../ui/button";

type ImageUploadProps = {
  selectedImage: string;
  filePath?: string;
  oldImage?: string | null;
  onImageUpdate: (imageUrl: string, image: string, filename: string) => void;
  onImageRemove: () => void;
};
export const ImageUpload = ({
  selectedImage,
  filePath = "/assets/temp",
  oldImage,
  onImageUpdate,
  onImageRemove,
}: ImageUploadProps) => {
  const router = useRouter();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("id", uuidv4());
      formData.append("image", file);
      formData.append("filePath", filePath);
      if (oldImage) formData.append("oldFile", oldImage);
      setLoading(true);
      axios.post("/api/upload/image", formData).then((response) => {
        const data = response.data;
        if (data.success)
          onImageUpdate(
            URL.createObjectURL(file),
            data.success.image,
            data.success.filename
          );
        setImage(data.success);
        router.refresh();
        if (data.error) toast.error(data.error);
      });
      setLoading(false);
    }
  };
  const onImageRemoved = () => {
    setLoading(true);
    axios.put("/api/upload/image", { oldFile: image }).then((response) => {
      const data = response.data;
      if (data.success) {
        setImage("");
        onImageRemove();
      }
      if (data.error) toast.error(data.error);
    });

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
        <div className="min-w-40 max-w-md aspect-video rounded flex items-center justify-center border-2 border-dashed hover:bg-accent cursor-pointer">
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
