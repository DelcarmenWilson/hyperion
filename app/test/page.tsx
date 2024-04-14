import Benefits from "@/components/index/Benefits";
import Collaboration from "@/components/index/Collaboration";
import Footer from "@/components/index/Footer";
import Header from "@/components/index/Header";
import Hero from "@/components/index/Hero";
import Pricing from "@/components/index/Pricing";
import { RoadmapList } from "@/components/index/RoadmapList";
import Services from "@/components/index/Services";
import { adminRoadmapsGetAllPublished } from "@/data/admin";
import ButtonGradient from "@/public/assets/index/svg/ButtonGradient";

const LandingPage = async () => {
  const roadmaps = await adminRoadmapsGetAllPublished();
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <RoadmapList roadmaps={roadmaps} />
        <Footer />
        <ButtonGradient />
      </div>
    </>
  );
};
export default LandingPage;
