"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Handles redirect to solver if user has set it as default homepage.
 * Only redirects from "/" to "/solver", not from any other page.
 */
export function HomepageRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run on the root path, and only once
    if (pathname !== "/" || hasChecked.current) return;

    hasChecked.current = true;
    const solverIsDefault = localStorage.getItem("solver-default-homepage") === "true";

    if (solverIsDefault) {
      router.replace("/solver");
    }
  }, [pathname, router]);

  return null;
}
