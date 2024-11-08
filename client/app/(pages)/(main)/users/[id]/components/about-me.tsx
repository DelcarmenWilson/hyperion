"use client";
import React from "react";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tiptap } from "@/components/reusable/tiptap";
import { useImageViewer } from "@/hooks/use-image-viewer";

type AboutMeProps = {
  firstName: string;
  lastName: string;
  image: string;
  aboutMe: string;
  title: string;
};
export const AboutMe = ({
  firstName,
  lastName,
  image,
  aboutMe,
  title,
}: AboutMeProps) => {
  const { onOpen } = useImageViewer();
  return (
    <Card className="sticky top-0 flex flex-col lg:flex-row flex-wrap col-span-2 gap-2 p-2">
      <div className="flex-center flex-col  text-center lg:w-[25%]">
        <div className="flex-center rounded-ful">
          <Image
            width={200}
            height={200}
            className="rounded-full shadow-sm shadow-white w-[200px] aspect-square"
            src={image || "/assets/defaults/teamImage.jpg"}
            alt="Profile Image"
            loading="lazy"
            priority={false}
            onClick={() => onOpen(image, "Profile Image")}
          />
        </div>
        <h4 className="text-xl font-bold my-2">
          {firstName} {lastName}
        </h4>
        <h4 className="text-muted-foreground">{title}</h4>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-center">ABOUT ME</h3>
        <div className="text-muted-foreground">
          <Tiptap
            description={aboutMe}
            controls={false}
            editable={false}
            onChange={() => {}}
          />
        </div>
      </div>
    </Card>
  );
};
