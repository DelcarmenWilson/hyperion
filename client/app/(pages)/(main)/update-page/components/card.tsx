"use client";
import Image from "next/image";
import { useImageViewerStore } from "@/stores/image-viewer-store";
import { PageUpdate } from "@prisma/client";
import { CardData } from "@/components/reusable/card-data";

export const PageUpdateCard = ({ update }: { update: PageUpdate }) => {
  const { onOpen } = useImageViewerStore();

  return (
    <div className="flex flex-col justify-between bg-gray-200 border rounded-sm p-2 lg:flex-row">
      <div>
        <CardData label="Type" value={update.type} />
        <CardData label="Title" value={update.title} />
        <CardData label="Description" value={update.description} />
      </div>
      <div>
        {update.image && (
          <Image
            className="shadow-sm shadow-white cursor-pointer"
            height={100}
            width={100}
            src={update.image}
            alt={update.title}
            onClick={() => onOpen(update.image, update.title)}
          />
        )}
      </div>
    </div>
  );
};
