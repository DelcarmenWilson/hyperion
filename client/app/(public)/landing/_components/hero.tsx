import { Button } from "@/components/ui/button";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-tr from-[#3A00E7] via-[#8C8DE2] to-[#AAABDA]">
      <div className="flex justify-center items-center gap-2 py-5">
        <p className="text-white">
          Ringy is evolving with new tools and features, designed around current
          industry trends. Check out our latest updates!
        </p>
        <Button variant="landingMain">Learn More</Button>
      </div>
    </div>
  );
};

export default Hero;
