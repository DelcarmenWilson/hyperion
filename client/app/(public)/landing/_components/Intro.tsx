import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Intro = () => {
  return (
    <div className="bg-gray-800 pt-[100px]">
      <div className="grid grid-cols-2">
        {/* Grid column1 */}
        <div className="space-y-3 p-4 font-serif">
            <p className="text-5xl font-extrabold text-white">Close More Sales with a Communications-focused CRM</p>
            <p className="text-2xl text-pink-500">Conversations drive sales. Ringy handles them for you.</p>
            <p className="text-lg font-normal text-white">Turn calls into customers with an automated sales platform that supports ambitious sales teams. </p>

        
            <Button variant="landingMain" className="!mt-[100px] uppercase" size="xl"> Try
                
                <span className="text-pink-500"> Hyperion </span> 
                 
                  for free</Button>


        </div>

        {/* Grid column2 */}
        <div>
       

       <Image src="/assets/landing/img1.jpeg" height={200} width={200} alt="image1" className="h-[500px] w-[800px] object-contain"/>

        </div>
      </div>
    </div>
  );
};

export default Intro;
