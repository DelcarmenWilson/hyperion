"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/modals/image";

import { userUpdateByIdImage } from "@/actions/user";

export const ProfileImage = ({ image }: { image: string }) => {
  const { update } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  const onImageUpdated = async (images: string[]) => {
    setModalOpen(false);
    const imageUpdated = await userUpdateByIdImage(images[0]);
    if (imageUpdated.success) {
      update();
      toast.success(imageUpdated.success);
    } else toast.error(imageUpdated.error);
  };
  return (
    <>
      <ImageModal
        title="Change Profile image?"
        filePath="users"
        oldFile={image}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImageUpdated}
      />
      <div className="flex mb-2 gap-2 items-center justify-center">
        <div className="relative text-center overflow-hidden rounded-full group">
          <Image
            width={100}
            height={100}
            className="rounded-full shadow-sm shadow-white w-[100px] aspect-square"
            src={image || "/assets/defaults/teamImage.jpg"}
            alt="Profile Image"
            loading="lazy"
            priority={false}
          />
          <Button
            className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100"
            variant="secondary"
            onClick={() => setModalOpen(true)}
          >
            CHANGE
          </Button>
        </div>
      </div>
    </>
  );
};
