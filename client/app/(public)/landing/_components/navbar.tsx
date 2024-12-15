"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hand, LucideIcon, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={cn(
        "container z-2 transition-colors duration-500",
        hasScrolled && "bg-black backdrop-blur-[8px]"
      )}
    >
      <div className="flex flex-col justify-between items-center text-white p-3 lg:flex-row">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src="/logo.png"
            height={44}
            width={44}
            className={cn("w-11 h-11 transition-all", hasScrolled && "w-9 h-9")}
            alt="logo"
          />
          <p className={cn("text-2xl font-bold", hasScrolled && "text-xl")}>
            Hyperion
          </p>
        </Link>

        <div className={cn("flex flex-col gap-3", hasScrolled && "gap-2")}>
          <div className="flex items-center justify-center lg:justify-end gap-2">
            <NavTopLink icon={Hand} href="" title="email support" />
            <NavTopLink icon={User} href="" title="login" />
            <NavTopLink icon={UserPlus} href="" title="try hyperion for free" />
          </div>

          <nav className="flex flex-col items-center justify-center lg:justify-end lg:flex-row gap-2">
            <div className="flex gap-1">
              <NavLink href="#" title="PRODUCT" />
              <NavLink href="#" title="USE CASES" />
              <NavLink href="#" title="CUSTOMER STORIES" />
              <NavLink href="#" title="PRICING" />
              <NavLink href="#" title="BLOB" />
            </div>
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
    <Link
      className=" hover:underline font-semibold text-sm lg:text-xs uppercase"
      href={href}
    >
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
