import { NavBar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";


const LeadsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className=" flex-1 bg-white w-full px-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LeadsLayout;
