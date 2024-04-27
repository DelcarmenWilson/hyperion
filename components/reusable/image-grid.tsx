import React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageGridProps = {
  images: string[];
  setModalOpen?: (e: boolean) => void;
  onImageRemove?: (e: number) => void;
  header?: boolean;
  enableButton?: boolean;
  smSize?: number;
  bgSize?: number;
};
export const ImageGrid = ({
  images,
  setModalOpen,
  onImageRemove,
  header = true,
  enableButton = false,
  smSize = 80,
  bgSize = 550,
}: ImageGridProps) => {
  return (
    <div>
      {header && (
        <div className="flex px-2 justify-between items-center">
          <p>Attachments</p>
          {enableButton && (
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

      {!images.length ? null : (
        <>
          {images.length > 1 ? (
            <div className="flex flex-wrap gap-2 p-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <Image
                    width={smSize}
                    height={smSize}
                    className={`h-[${smSize}px] w-[${smSize}px]`}
                    src={img}
                    alt={`Image${index}`}
                  />
                  <Button
                    size="xs"
                    className="absolute top-0 right-0 rounded-full opacity-0 group-hover:opacity-100"
                    type="button"
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
            <div
              className={cn(
                "relative group",
                bgSize == 550
                  ? "h-full w-full"
                  : `h-[${bgSize}px] w-[${bgSize}px]`
              )}
            >
              <Image
                width={bgSize}
                height={bgSize}
                className={
                  bgSize == 550
                    ? "h-full w-full"
                    : `h-[${bgSize}px] w-[${bgSize}px]`
                }
                src={images[0]}
                alt="Image Grid"
              />
              <Button
                size="xs"
                className="absolute top-0 right-0 rounded-full opacity-0 group-hover:opacity-100"
                type="button"
                onClick={() => {
                  if (onImageRemove) onImageRemove(0);
                }}
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </>
      )}

      {/* {images.length > 1 ? (
        <div className="flex flex-wrap gap-2 p-2">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <Image
                width={size}
                height={size}
                className={`h-[${size}px] w-[${size}px]`}
                src={img}
                alt={`Image${index}`}
              />
              <Button
                size="xs"
                className="absolute top-0 right-0 rounded-full opacity-0 group-hover:opacity-100"
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
      )} */}

      {header && !images?.length && (
        <p className="text-center mt-10 w-full text-muted-foreground">
          No Attachments found
        </p>
      )}
    </div>
  );
};
