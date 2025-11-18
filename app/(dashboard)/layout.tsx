import type { ReactNode } from "react";

import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    index: false,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
