import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
};
export const CustomDialog = ({
  title,
  children,
  description,
  open,
  onClose,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="hidden">
            {description}
          </DialogDescription>
        </DialogHeader>
        {/* <h3 className="text-2xl font-semibold py-2">
            WorkFlow Info -{" "}
            <span className="text-primary">{workflow.title}</span>
          </h3> */}
        {children}
      </DialogContent>
    </Dialog>
  );
};
