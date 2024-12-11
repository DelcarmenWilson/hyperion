"use client";
import React, { useRef } from "react";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BusinessCarousel = () => {
  return (
    <div className="container  bg-gradient-to-r from-[#8c00ff] to-[#50e6c8] p-16 ">
      <div className="flex flex-col gap-5 items-center justify-between lg:flex-row">
        <p className="text-white text-xl">These businesses trust Hyperion.</p>
        <CarouselSpacing />
      </div>
    </div>
  );
};

const carriers = [
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/40d01b323b6b323cad556e32919cfeaef138aec33696196e9784df4cebc475be.jpeg",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/10f7233774814e7608a80d4236b1aa616a32d93f7f1746d5cfc5bfe65e49768f.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/0683207a8756e5baee415705378b81a140ce41346b7b0809f91a54409810ca5b.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/62c788bead294996ccd22f567b96ab4e506890c7d16c0e84c7eb366358bbc7a5.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/9dca05e90df74f16cf4886b3d53d87ef55144dae328879f7352d3e41c508322e.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/d40ccb2b27d4568b663d7aa4a8286ecbc41ec2ebd4e9b8ef3aba2ad6544c9cdb.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/97c2e184d59db577de652aebca18b2c95a1a2aa3b218ce3c147a86b7f58f38a1.png",
  "https://hyperioncrm.s3.us-east-2.amazonaws.com/carriers/ad55ac6ab26aa738ae1f4d11927428f8473ca4ad31c6b31e7885ecbc7c517303.jpeg",
];

const CarouselSpacing = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      className="flex-1 flex gap-2 items-center justify-between w-full "
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselPrevious />
      <CarouselContent className="-ml-1 w-full">
        {carriers.map((carrier, index) => (
          <CarouselItem
            key={index}
            className="pl-1 md:basis-1/2 lg:basis-1/3 flex-center"
          >
            <Image
              src={carrier}
              width={200}
              height={50}
              className="w-[200px] h-[50px]"
              alt={carrier}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
};

export default BusinessCarousel;
