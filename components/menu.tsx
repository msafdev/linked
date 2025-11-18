"use client";

import { toast } from "sonner";

import {
  PiEqualsBold,
  PiGearDuotone,
  PiHouseDuotone,
  PiLayoutDuotone,
  PiSignInDuotone,
  PiSignOutDuotone,
  PiXBold,
} from "react-icons/pi";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi, authQueryKeys } from "@/api";
import { DASHBOARD_BASE_PATH } from "@/lib/config";
import { cn } from "@/lib/utils";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  onClick: () => void | Promise<void>;
  ariaLabel: string;
  disabled?: boolean;
}

export type MenuSessionState = "authenticated" | "unauthenticated";

type MenuProps = {
  className?: string;
  sessionState: MenuSessionState;
};

export function Menu({ className, sessionState }: MenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      setIsOpen(false);
      queryClient.setQueryData(authQueryKeys.session(), null);
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session(),
      });
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("[Menu][Logout Error]", error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Unable to log out. Please try again.",
      );
    },
  });

  const hasAccount = sessionState === "authenticated";

  const menuItems: MenuItem[] = useMemo(() => {
    const homeItem: MenuItem = {
      key: "home",
      icon: <PiHouseDuotone size={16} />,
      ariaLabel: "Go to home",
      onClick: () => router.push("/"),
    };

    if (hasAccount) {
      return [
        homeItem,
        {
          key: "dashboard",
          icon: <PiLayoutDuotone size={16} />,
          ariaLabel: "Open dashboard",
          onClick: () => router.push(DASHBOARD_BASE_PATH),
        },
        {
          key: "settings",
          icon: <PiGearDuotone size={16} />,
          ariaLabel: "Open settings",
          onClick: () => router.push(`${DASHBOARD_BASE_PATH}/settings`),
        },
        {
          key: "logout",
          icon: <PiSignOutDuotone size={16} />,
          ariaLabel: isLoggingOut ? "Logging out" : "Log out",
          onClick: () => logout(),
          disabled: isLoggingOut,
        },
      ];
    }

    return [
      homeItem,
      {
        key: "login",
        icon: <PiSignInDuotone size={16} />,
        ariaLabel: "Go to login",
        onClick: () => router.push("/auth/login"),
      },
    ];
  }, [hasAccount, isLoggingOut, logout, router]);

  const handleMenuItemClick = useCallback((item: MenuItem) => {
    if (item.disabled) return;
    setIsOpen(false);
    Promise.resolve(item.onClick()).catch((error) =>
      console.error("[Menu][Action Error]", error),
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const el = containerRef.current;
      if (!el || el.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed top-5 right-5 z-[1000] flex flex-col items-center gap-3",
        className,
      )}
    >
      <button
        onClick={handleToggle}
        className={cn(
          "flex size-14 items-center justify-center rounded-full border transition-colors duration-200",
          "bg-accent text-accent-foreground border-border cursor-pointer",
          "hover:bg-accent/80",
          isOpen &&
            "bg-primary text-primary-foreground border-primary hover:bg-primary",
        )}
        type="button"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <span
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-90" : "rotate-0",
          )}
        >
          {isOpen ? <PiXBold size={20} /> : <PiEqualsBold size={20} />}
        </span>
      </button>

      <div
        className={cn(
          "flex flex-col items-center gap-2 overflow-hidden transition-all duration-200 ease-out",
          "origin-top",
          isOpen
            ? "pointer-events-auto max-h-96 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleMenuItemClick(item)}
            className="bg-accent text-accent-foreground hover:bg-accent/80 flex size-12 cursor-pointer items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            aria-label={item.ariaLabel}
            title={item.ariaLabel}
            disabled={item.disabled}
            tabIndex={isOpen ? 0 : -1}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
