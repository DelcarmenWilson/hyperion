import { RefreshCw } from "lucide-react";

const Loader = ({ size = 50 }: { size?: number }) => {
  return (
    // <div className="flex-center flex-col flex-1 w-full">
    <div className="flex-center flex-col flex-1 bg-secondary w-full h-full rounded-sm p-4">
      <RefreshCw size={size} className="animate-spin" />
    </div>
  );
};

export default Loader;
