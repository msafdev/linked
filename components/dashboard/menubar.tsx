"use client";

import { AnimatePresence, motion } from "motion/react";

import { PiEqualsBold, PiXBold } from "react-icons/pi";

import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import type { DashboardNavItem } from "./nav-utils";

type MenubarProps = {
  items: DashboardNavItem[];
};

export function Menubar({ items }: MenubarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const el = panelRef.current;
      const trigger = triggerRef.current;
      const target = event.target as Node;
      if (
        (el && el.contains(target)) ||
        (trigger && trigger.contains(target))
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed top-5 right-5 z-[1000] flex flex-col items-end gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          ref={triggerRef}
          className={cn(
            "flex size-12 items-center justify-center rounded-full border transition-colors duration-200",
            "bg-accent text-accent-foreground border-border cursor-pointer",
            "hover:bg-accent/80 focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isOpen &&
              "text-foreground hover:bg-secondary hover:text-secondary-foreground border-transparent bg-transparent",
          )}
          aria-expanded={isOpen}
          aria-label="Toggle dashboard navigation"
        >
          <span
            className={cn(
              "transition-transform duration-200",
              isOpen ? "rotate-90" : "rotate-0",
            )}
          >
            {isOpen ? <PiXBold size={18} /> : <PiEqualsBold size={18} />}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="bg-background/80 fixed inset-0 z-[950] flex items-center justify-center"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-hidden={!isOpen}
          >
            <motion.div
              className="mx-auto flex w-full max-w-sm justify-center px-6"
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(2px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div ref={panelRef} className="w-full">
                <ul className="flex flex-col gap-3 text-center">
                  {items.map(({ key, label, href }) => {
                    const isActive =
                      pathname === href || pathname?.startsWith(`${href}/`);
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            router.push(href);
                          }}
                          className={cn(
                            "font-heading w-full text-base font-medium transition-colors",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          aria-current={isActive ? "page" : undefined}
                          aria-label={`Go to ${label}`}
                        >
                          {label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
