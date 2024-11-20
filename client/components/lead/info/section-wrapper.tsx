import { Button } from "@/components/ui/button";
import { FilePenLine, Plus } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  showAdd?: boolean;
};

export const SectionWrapper = ({
  title,
  children,
  onClick,
  showAdd = false,
}: Props) => {
  return (
    <div className="border rounded shadow-md p-2">
      <div className="flex justify-between items-center pb-1">
        <h4 className="text-muted-foreground">{title}</h4>
        {onClick && (
          <Button size="icon" variant="outlineprimary" onClick={onClick}>
            {showAdd ? <Plus size={16} /> : <FilePenLine size={16} />}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};
