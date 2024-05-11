import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
    // <Card>
    //     <CardHeader>
    //         <Header label="Oops! Something went wrong"/>
    //     </CardHeader>
    //     <CardFooter>
    //         <BackButton label="Back to Login" href="/login"/>
    //     </CardFooter>
    // </Card>
  );
};
