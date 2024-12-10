import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hand, LucideIcon, User, UserPlus } from "lucide-react";

const Navbar = () => {
  return (
    <div className="container absolute z-2 top-0">
      <div className="flex justify-between items-center text-white  p-3">
        <Link href="/" className="flex gap-2 items-center">
          <Image src="/logo3.png" height={36} width={36} alt="logo" />
          <p className="text-xl font-bold">Hyperion</p>
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2">
            <NavTopLink icon={Hand} href="" title="email support" />
            <NavTopLink icon={User} href="" title="login" />
            <NavTopLink icon={UserPlus} href="" title="try hyperion for free" />
          </div>

          <nav className="flex items-center justify-end gap-2">
            <NavLink href="#" title="PRODUCT" />
            <NavLink href="#" title="USE CASES" />
            <NavLink href="#" title="CUSTOMER STORIES" />
            <NavLink href="#" title="PRICING" />
            <NavLink href="#" title="BLOB" />

            <Button variant="landingOutline" className="uppercase">
              request a demo
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ title, href }: { title: string; href: string }) => {
  return (
    <Link className=" hover:underline font-semibold uppercase" href={href}>
      {title}
    </Link>
  );
};

const NavTopLink = ({
  icon: Icon,
  title,
  href,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
}) => {
  return (
    <Link
      className="flex gap-2  hover:underline text-sm font-semibold  uppercase"
      href={href}
    >
      <Icon size={16} />
      <span>{title}</span>
    </Link>
  );
};

export default Navbar;
