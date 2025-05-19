"use client";

import { Toaster as Toasty } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Toaster() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toasty
      richColors
      theme={theme === "system" ? undefined : theme as "light" | "dark" | undefined}
    />
  );
}
