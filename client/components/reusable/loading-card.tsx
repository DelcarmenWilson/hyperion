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
        <div className="flex-center rounded-full border border-primary border-separate p-2 animate-fill">
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