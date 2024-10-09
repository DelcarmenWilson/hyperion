"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/reusable/loader";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";

const LoggedInPage = () => {
  const user = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (!mounted) return;
    if (!user) redirect("/login");
    if (user.role == "MASTER") redirect("/admin/teams");
    else redirect("/dashboard");
  }, [mounted]);

  return <Loader text="Logging you in please wait..." />;
};

export default LoggedInPage;
