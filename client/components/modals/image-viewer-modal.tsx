"use client";

import Image from "next/image";
import { useImageViewerStore } from "@/stores/image-viewer-store";

import { CustomDialog } from "../global/custom-dialog";

export const ImageViewerModal = () => {
  const { isOpen, onClose, imageUrl, alt } = useImageViewerStore();

  if (!imageUrl) return null;
  return (
    <CustomDialog
      open={isOpen}
      onClose={onClose}
      title=""
      description="Image Viewer Form"
    >
      <Image
        width={500}
        height={500}
        className="w-full h-full"
        src={imageUrl}
        alt={alt as string}
      />
    </CustomDialog>
  );
};
