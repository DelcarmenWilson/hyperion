import { RefreshCw } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full">
      <RefreshCw size={50} className=" animate-spin" />
    </div>
  );
};

export default Loader;
