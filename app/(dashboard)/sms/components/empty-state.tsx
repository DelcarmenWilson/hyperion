import Image from "next/image";

const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center bg-accent">
      <Image
        src="/logo2.png"
        alt="Logo"
        width="200"
        height="200"
        className="grayscale dark:opacity-50 "
      />
      <div className="text-muted-foreground text-center text-2xl font-semibold">
        <p>Select a conversation</p>
        <p>OR</p>
        <p>Start a new conversation</p>
      </div>
    </div>
  );
};

export default EmptyState;
