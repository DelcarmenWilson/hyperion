"use client";

import Benefits from "@/components/index/Benefits";
import Button from "@/components/index/Button";
import Collaboration from "@/components/index/Collaboration";
import Footer from "@/components/index/Footer";
import Header from "@/components/index/Header";
import Hero from "@/components/index/Hero";
import Pricing from "@/components/index/Pricing";
import Roadmap from "@/components/index/Roadmap";
import Services from "@/components/index/Services";
import ButtonGradient from "@/public/assets/index/svg/ButtonGradient";

export default function Home() {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <Roadmap />
        <Footer />
        <ButtonGradient />
      </div>
    </>
  );
}
