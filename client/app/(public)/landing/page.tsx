import React from "react";
import "./index.css";
import Header from "./_components/header";
import Hero from "./_components/hero";
import BusinessCarousel from "./_components/business-carousel";
import Pricing from "./_components/pricing";
import Testimonials from "./_components/testimonials";
import Features from "./_components/features/features";

const HyperionLandingPage = () => {
  return (
    <main className="overflow-hidden bg-black w-full pb-20">
      <Header />
      <Hero />
      <BusinessCarousel />
      <Pricing />
      <Testimonials/>
      <Features/>
    </main>
  );
};

export default HyperionLandingPage;
