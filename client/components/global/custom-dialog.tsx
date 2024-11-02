import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
  description?: string;
  showDescription?: boolean;
  open: boolean;
  onClose: () => void;
  maxWidth?: boolean;
  maxHeight?: boolean;
};
export const CustomDialog = ({
  children,
  title,
  subTitle,
  description,
  showDescription = false,
  open,
  onClose,
  maxWidth = false,
  maxHeight = false,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "flex flex-col justify-start min-w-[50%]  min-h-[60%] h-full overflow-hidden",
          maxWidth ? "max-w-screen-lg" : "max-w-[60%]",
          maxHeight ? "max-h-screen" : "max-h-[75%]"
        )}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold">
            {title}
            {subTitle && (
              <>
                {" "}
                - <span className="text-primary">{subTitle}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className={cn(showDescription ? "" : "hidden")}>
            {description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="pe-2">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
