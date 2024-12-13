import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="container bg-hero pt-[calc(152px+5rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Grid column1 */}
        <div className="space-y-3 p-4 font-serif text-center lg:text-left">
          <p className="text-5xl font-extrabold text-white">
            Close More Sales with a Communications-focused CRM
          </p>
          <p className="text-2xl text-pink-500">
            Conversations drive sales. Hyperion handles them for you.
          </p>
          <p className="text-lg font-normal text-white">
            Turn calls into customers with an automated sales platform that
            supports ambitious sales teams.
          </p>

          <Button variant="landingMain" className="!mt-10 uppercase" size="xl">
            Try &nbsp;
            <span className="text-pink-500">Hyperion</span>
            &nbsp; for free
          </Button>
        </div>

        {/* Grid column2 */}
        <div className="px-5">
          <div className="rounded bg-white p-2">
            <Image
              src="/assets/landing/dashboard.png"
              height={800}
              width={800}
              alt="image1"
              className="w-full aspect-video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
