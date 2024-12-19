import Image from "next/image";
import { TextAnimation } from "../custom/text-animate";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="width-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold flex justify-between items-center gap-x-2">
        <Image
          src="/logo.png"
          width="60"
          height="60"
          className="w-[60px] h-[60px]"
          alt="logo"
        />
        <TextAnimation text="Hyperion" />
      </h1>
      <p className="text-muted-forground text-sm">{label}</p>
    </div>
  );
};
