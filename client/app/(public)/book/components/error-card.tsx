import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
  return (
    <div className="flex-center h-full">
      <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/page"
      >
        <div className="w-full flex justify-center items-center">
          <ExclamationTriangleIcon className="text-destructive" />
        </div>
      </CardWrapper>
    </div>
  );
};
