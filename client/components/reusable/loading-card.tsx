import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextAnimation } from "../custom/text-animate";

type Props = {
  title?: string;
  subTitle?: React.ReactNode;
};
export const LoadingCard = ({ title = "loading", subTitle }: Props) => {
  return (
    <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0 border-0 shadow-none">
      <CardContent className="flex-center flex-col h-full gap-2 text-muted-foreground  overflow-hidden p-0 border-0">
        <div className="relative rounded-full border border-primary border-separate animate-fill w-100 h-100">
          <Image
            height={80}
            width={80}
            className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-secondary/20 p-4 rounded-full"
            src="/logo3.png"
            alt="logo"
            priority
          />
        </div>
        <TextAnimation
          text={title}
          textAnchor="middle"
          viewBox="0 0 800 160"
          x="50%"
          y="50%"
        />
        <h4 className="text-sm text-center">{subTitle}</h4>
      </CardContent>
    </Card>
  );
};
