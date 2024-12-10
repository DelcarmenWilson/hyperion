import React from "react";
import "./index.css";
import Header from "./_components/header";
import Hero from "./_components/hero";
import BusinessCarousel from "./_components/business-carousel";
import Pricing from "./_components/pricing";

const HyperionLandingPage = () => {
  return (
    <main className="overflow-hidden bg-black w-full pb-20">
      <Header />
      <Hero />
      <BusinessCarousel />
      <Pricing />
    </main>
  );
};

export default HyperionLandingPage;
