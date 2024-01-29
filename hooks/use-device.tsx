import { useEffect, useState } from "react";

export const useDevice2 = () => {
  const [mounted, setMounted] = useState(false);

  const dv = typeof window !== "undefined" ? device : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }
  return dv;
};
