import { Card, CardContent } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};
export const CardLayout = ({ children }: Props) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden !p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden !p-0">
        {children}
      </CardContent>
    </Card>
  );
};
