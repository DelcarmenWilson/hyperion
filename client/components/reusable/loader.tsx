import { RefreshCw } from "lucide-react";

type LoaderProps = {
  size?: number;
  text?: string;
};
const Loader = ({ size = 50, text }: LoaderProps) => {
  return (
    <div className="flex-center flex-col flex-1 bg-secondary w-full h-full rounded-sm p-4">
      <RefreshCw size={size} className="animate-spin" />
      <h4 className="text-md text-muted-foreground">{text}</h4>
    </div>
  );
};

export default Loader;
