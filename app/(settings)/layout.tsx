import NavBar from "@/components/navbar";
import { Sidebar } from "./components/sidebar";

const LeadsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className=" flex-1 w-full px-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default LeadsLayout;
