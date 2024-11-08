import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Props = {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  titleClassName?: string;
  subTitleClassName?: string;
  iconClassName?: string;
};

const CustomDialogHeader = ({
  title,
  subTitle,
  icon,
  titleClassName,
  subTitleClassName,
  iconClassName,
}: Props) => {
  const Icon = icon;
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-1">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassName)} />
          )}
          {title && (
            <p className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </p>
          )}
          {subTitle && (
            <p
              className={cn("text-sm text-muted-foreground", subTitleClassName)}
            >
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
