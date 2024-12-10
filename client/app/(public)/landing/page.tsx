import React from "react";
import Hero from "./_components/hero";
import "./index.css";
import Navbar from "./_components/navbar";
import Intro from "./_components/Intro";

const HyperionLandingPage = () => {
  return (
    <>
      <Hero />
      <div className="relative">
      <Navbar />
      <Intro/>
      </div>
    </>
  );
};

export default HyperionLandingPage;
