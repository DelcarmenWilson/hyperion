"use client";
import Image from "next/image";
import { adminEmitter } from "@/lib/event-emmiter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TempFolderCardProps = {
  image: string;
};

export const TempFolderCard = ({ image }: TempFolderCardProps) => {
  const url = `/assets/temp/${image}`;

  const onImageDeleted = () => {
    adminEmitter.emit("tempImageDeleted", image);
  };

  return (
    <>
      <div className="flex flex-col justify-center border rounded-xl p-2 overflow-hidden text-sm">
        <div className="relative">
          <Button
            variant="ghost"
            size="xs"
            className="absolute top-0 right-0"
            type="button"
            onClick={onImageDeleted}
          >
            <X size={16} />
          </Button>
          <Image
            width={100}
            height={100}
            className="h-[100px] w-[100px]"
            src={url}
            alt="Temp Image"
          />
        </div>
      </div>
    </>
  );
};
