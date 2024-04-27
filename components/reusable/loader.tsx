import { RefreshCw } from "lucide-react";

const Loader = ({ size = 50 }: { size?: number }) => {
  return (
    <div className="flex-center flex-1 w-full">
      <RefreshCw size={size} className="animate-spin" />
    </div>
  );
};

export default Loader;
