"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const links = [
  { href: "/leads", title: "Leads" },
  { href: "/csv", title: "Csv" },
  { href: "/twilio", title: "Twilio" },
  { href: "/chat", title: "Chat" },
];

export const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-secondary flex justify-between items-center p-4 shadow-sm">
      <div className="flex gap-x-2">
        <Link href="/" className="flex justify-between items-center">
          <Image
            src="/logo.png"
            width="24"
            height="24"
            alt="logo"
            className="mr-2 h-10 w-10"
          />
          <span>Strong Side</span>
        </Link>
        {/* <Button asChild variant={pathname==="/server"?"default":"outline"}> */}

        <div className="flex gap-x-2">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className={cn(
                pathname === link.href ? "" : "text-muted-foreground",
                "text-sm "
              )}
            >
              <Link href={link.href}>{link.title}</Link>
            </Button>
          ))}
        </div>
      </div>
      <UserButton />
    </nav>
  );
};
