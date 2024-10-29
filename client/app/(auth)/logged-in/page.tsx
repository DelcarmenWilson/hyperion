"use client";
import React, { useEffect } from "react";
import Loader from "@/components/reusable/loader";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";

const LoggedInPage = () => {
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (!user) router.push("/login");
      if (user?.role == "MASTER") router.push("/admin/teams");
      else router.push("/dashboard");
    }, 2000);
  }, []);

  return <Loader text="Logging you in please wait..." />;
};

export default LoggedInPage;
