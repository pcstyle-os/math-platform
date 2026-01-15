"use client";

import { useLayoutEffect } from "react";

/**
 * Solver Layout - Disables the TutorSidebar on this page
 * by adding a data attribute that the sidebar checks
 */
export default function SolverLayout({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    document.body.setAttribute("data-hide-tutor", "true");
    return () => {
      document.body.removeAttribute("data-hide-tutor");
    };
  }, []);

  return <>{children}</>;
}
