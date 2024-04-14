import React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageGridProps = {
  role: string;
  status: string;
  images: string[];
  setModalOpen?: (e: boolean) => void;
  onImageRemove?: (e: number) => void;
  header?: boolean;
};
export const ImageGrid = ({
  role,
  status,
  images,
  setModalOpen,
  onImageRemove,
  header = true,
}: ImageGridProps) => {
  return (
    <div>
      {header && (
        <div className="flex px-2 justify-between items-center">
          <p>Attachments</p>
          {role != "MASTER" && status != "Resolved" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (setModalOpen) setModalOpen(true);
              }}
            >
              <Plus size={15} className="mr-1" /> Add Attachments
            </Button>
          )}
        </div>
      )}

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2 p-2">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <Image
                width={80}
                height={80}
                className="h-[80px] w-[80px]"
                src={img}
                alt={`Image${index}`}
              />
              <Button
                size="xs"
                className="absolute top-0 right-0 rounded-full opacity-0"
                onClick={() => {
                  if (onImageRemove) onImageRemove(index);
                }}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="relative">
            <Image
              width={550}
              height={550}
              className="h-full w-full"
              src={images[0]}
              alt="Image Grid"
            />
            <Button
              size="xs"
              className="absolute top-0 right-0 rounded-full opacity-0"
              onClick={() => {
                if (onImageRemove) onImageRemove(0);
              }}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}

      {header && !images.length && (
        <p className="text-center mt-10 w-full text-muted-foreground">
          No Attachments found
        </p>
      )}
    </div>
  );
};
