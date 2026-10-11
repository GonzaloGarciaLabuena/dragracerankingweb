"use client";

import { useEffect, useState } from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}