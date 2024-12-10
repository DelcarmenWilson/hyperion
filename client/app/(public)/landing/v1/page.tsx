import Benefits from "./_components/Benefits";
import Collaboration from "./_components/Collaboration";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Pricing from "./_components/Pricing";
import { TaskList } from "./_components/TaskList";
import Services from "./_components/Services";
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
