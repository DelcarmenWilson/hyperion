"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";


  const links = [
  { href: "/leads", title: "Leads" },
  { href: "/server", title: "Server" },
  { href: "/client", title: "Client" },
  { href: "/admin", title: "Admin" },
  { href: "/settings", title: "Settings" },
];

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex flex-col justify-between items-center p-4 h-full  shadow-sm">
      <div className="flex flex-col gap-y-2">
        {links.map((link)=>(
          <Button
          key={link.href}
          asChild
          variant={pathname === link.href ? "default" : "outline"}
        >
          <Link href={link.href}>{link.title}</Link>
        </Button>

        ))}
        

        {/* <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button> */}
      </div>
      <UserButton />
    </nav>
  );
};
