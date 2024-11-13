"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Thumbnail } from "../global/message/thumnail";

type Props = {
  images: string[];
  setModalOpen?: (e: boolean) => void;
  onImageRemove?: (e: number) => void;
  header?: boolean;
  enabled?: boolean;
};
export const ImageGrid = ({
  images,
  setModalOpen,
  onImageRemove,
  header = true,
  enabled = false,
}: Props) => {
  return (
    <div>
      {header && (
        <div className="flex px-2 justify-between items-center">
          <p className={cn("font-semibold", !enabled && "text-center flex-1")}>
            Attachments
          </p>
          {enabled && (
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

      <div className="flex flex-wrap gap-2 p-2">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <Thumbnail url={img} />
            {enabled && (
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
            )}
          </div>
        ))}
      </div>

      {header && !images?.length && (
        <p className="text-center mt-10 w-full text-muted-foreground">
          No Attachments Found
        </p>
      )}
    </div>
  );
};
