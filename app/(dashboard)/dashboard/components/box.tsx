import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface BoxProps {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
}
export const Box = ({
  icon: Icon,
  title,
  value,
  href,
  hrefTitle,
}: BoxProps) => {
  return (
    <Card className="relative  overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-accent p-4 rounded-br-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
          <span className="text-sm text-muted-foreground block">{title}</span>
          <span className="text-lg text-primary font-medium">{value}</span>
        </CardTitle>
      </div>

      <Separator />
      <CardContent className="flex p-2">
        <Link href={href} className="text-primary flex hover:font-semibold">
          <Icon className="h4 w-4 mr-1" />
          <span>{hrefTitle}</span>
        </Link>
      </CardContent>
    </Card>
  );
};