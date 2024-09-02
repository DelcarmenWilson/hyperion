import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type EmptyCardProps = {
  title: string;
  subTitle?: React.ReactNode;
};
export const EmptyCard = ({ title, subTitle }: EmptyCardProps) => {
  return (
    <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0">
      <CardContent className="flex-center flex-col h-full gap-2 text-muted-foreground  overflow-hidden p-0">
        <Image
          height={80}
          width={80}
          className="w-[80px] h-[80px] grayscale opacity-50"
          src="/logo3.png"
          alt="logo"
          priority
        />
        <h4 className="text-lg">{title}</h4>
        <h4 className="text-sm">{subTitle}</h4>
      </CardContent>
    </Card>
  );
};
