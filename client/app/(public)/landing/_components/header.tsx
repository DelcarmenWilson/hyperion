import { Button } from "@/components/ui/button";
import React from "react";
import Navbar from "./navbar";

const Header = () => {
  return (
    <div className="fixed top-0 w-full z-2">
      <div className="bg-landing flex justify-center items-center gap-2 py-3">
        <p className="text-white">
          Hyperion is evolving with new tools and features, designed around
          current industry trends. Check out our latest updates!
        </p>
        <Button variant="landingMain">Learn More</Button>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;