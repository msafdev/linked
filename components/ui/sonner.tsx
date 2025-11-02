"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import {
  LuBadgeAlert,
  LuBadgeCheck,
  LuBadgeInfo,
  LuBadgeX,
  LuLoaderCircle,
} from "react-icons/lu";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      duration={2000}
      toastOptions={{
        className: "!py-3.5 !px-5 !gap-3",
        classNames: {
          success: "!bg-popover !text-popover-foreground !border-border",
          error: "!bg-popover !text-popover-foreground !border-border",
          warning: "!bg-popover !text-popover-foreground !border-border",
          info: "!bg-popover !text-popover-foreground !border-border",
          loading: "!bg-popover !text-popover-foreground !border-border",
          title: "!font-semibold !text-foreground !text-xs",
          content: "!flex !items-center !gap-2",
        },
      }}
      icons={{
        success: (
          <LuBadgeCheck className="text-popover size-5 fill-green-500" />
        ),
        info: <LuBadgeInfo className="text-popover size-5 fill-blue-500" />,
        warning: (
          <LuBadgeAlert className="text-popover size-5 fill-yellow-500" />
        ),
        error: <LuBadgeX className="text-popover size-5 fill-red-500" />,
        loading: <LuLoaderCircle className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
