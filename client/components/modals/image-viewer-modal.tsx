"use client";

import Image from "next/image";
import { useImageViewer } from "@/hooks/use-image-viewer";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export const ImageViewerModal = () => {
  const { isOpen, onClose, imageUrl, alt } = useImageViewer();

  if (!imageUrl) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[60%] max-h-[75%] w-full bg-transparent p-0 border-0 overflow-hidden ">
        <Image
          width={500}
          height={500}
          className="w-full h-full"
          src={imageUrl}
          alt={alt as string}
        />
      </DialogContent>
    </Dialog>
  );
};
