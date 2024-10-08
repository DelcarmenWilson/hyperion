import Benefits from "@/components/index/Benefits";
import Collaboration from "@/components/index/Collaboration";
import Footer from "@/components/index/Footer";
import Header from "@/components/index/Header";
import Hero from "@/components/index/Hero";
import Pricing from "@/components/index/Pricing";
import { TaskList } from "@/components/index/TaskList";
import Services from "@/components/index/Services";
import ButtonGradient from "@/public/assets/index/svg/ButtonGradient";
import { tasksGetAllPublished } from "@/data/task";

const LandingPage = async () => {
  const tasks = await tasksGetAllPublished();
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <TaskList tasks={tasks} />
        <Footer />
        <ButtonGradient />
      </div>
    </>
  );
};
export default LandingPage;
