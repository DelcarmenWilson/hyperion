import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextAnimation } from "../custom/text-animate";

type EmptyCardProps = {
  title: string;
  subTitle?: React.ReactNode;
};
export const EmptyCard = ({ title, subTitle }: EmptyCardProps) => {
  return (
    <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0 border-0 shadow-none">
      <CardContent className="flex-center flex-col h-full gap-2 text-muted-foreground  overflow-hidden p-0 border-0">
        <div className="flex-center rounded-full border border-primary border-separate p-2 animate-bounce">
          <Image
            height={80}
            width={80}
            className="w-[80px] h-[80px] opacity-50"
            src="/logo3.png"
            alt="logo"
            priority
          />
        </div>
        <TextAnimation
          text={title}
          textAnchor="left"
          viewBox="0 0 800 160"
          x="0"
          y="70%"
        />
        {/* <h4 className="text-lg text-center">{title}</h4> */}
        <h4 className="text-sm text-center">{subTitle}</h4>
      </CardContent>
    </Card>
  );
};
