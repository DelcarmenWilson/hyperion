import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type CardBoxProps = {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
};
export const CardBox = ({
  icon: Icon,
  title,
  value,
  href,
  hrefTitle,
}: CardBoxProps) => {
  return (
    <Card className="relative overflow-hidden w-full group">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-accent p-4 rounded-br-lg">
          <Icon size={20} className="text-primary group-hover:animate-bounce" />
        </div>
        <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
          <span className="text-sm text-muted-foreground block">{title}</span>
          <span className="text-lg text-primary font-medium">{value}</span>
        </CardTitle>
      </div>

      <Separator />
      <CardContent className="flex p-2">
        <Link
          href={href}
          className="text-primary flex items-center hover:font-semibold gap-1"
        >
          <Icon size={16} />
          <span>{hrefTitle}</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export const BoxSkeleton = () => {
  return (
    <Card className="relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="w-[50px] aspect-square rounded-br-lg" />
        <CardTitle className="flex flex-col items-end gap-1 mr-6">
          <Skeleton className="w-[100px] h-5" />
          <Skeleton className="w-5 h-5" />
        </CardTitle>
      </div>

      {/* <Separator /> */}
      <CardContent className="flex p-2 border-t">
        <Skeleton className="h-6 w-[150px]" />
      </CardContent>
    </Card>
  );
  // return <Skeleton className="min-h-[32px] w-full rounded-sm mb-2" />;
};
