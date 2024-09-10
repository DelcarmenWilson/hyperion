import { CardLayout } from "@/components/custom/layout/card";
import { ConversationsClient } from "./components/client";

type Props = {
  children: React.ReactNode;
};
const ConversationsLayout =  ({ children }: Props) => {
  return (
    <CardLayout>
      <ConversationsClient />
      {children}
    </CardLayout>
  );
};

export default ConversationsLayout;
