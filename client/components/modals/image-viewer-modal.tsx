"use client";

import Image from "next/image";
import { useImageViewer } from "@/hooks/use-image-viewer";

import { CustomDialog } from "../global/custom-dialog";

export const ImageViewerModal = () => {
  const { isOpen, onClose, imageUrl, alt } = useImageViewer();

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
