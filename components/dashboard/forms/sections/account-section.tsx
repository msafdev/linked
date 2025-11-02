"use client";

import type { FormikProps } from "formik";
import { getIn } from "formik";
import { toast } from "sonner";

import { PiArrowUpRightBold, PiSignOutDuotone } from "react-icons/pi";

import { type ChangeEvent, type ReactNode, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authApi } from "@/api";
import type { SectionInitialValuesMap } from "@/lib/schema";
import { SITE_BASE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type SettingsFormik = FormikProps<SectionInitialValuesMap["settings"]>;

const DOMAIN_PREFIX = SITE_BASE_URL.replace(/^https?:\/\//, "");

export function renderSettingsSection(formik: SettingsFormik): ReactNode {
  const domainValue = formik.values.domain ?? "";
  const billingStatus = formik.values.billingStatus ?? "";
  const billingType = formik.values.billingType ?? "";
  const displayDomain =
    domainValue && domainValue.length > 0 ? domainValue : "username";

  const liveSiteHref =
    domainValue && domainValue.trim().length > 0
      ? `/${domainValue.trim().toLowerCase()}`
      : "/";

  const router = useRouter();
  const logoutToastRef = useRef<string | number | null>(null);
  const dismissLogoutToast = () => {
    if (logoutToastRef.current) {
      toast.dismiss(logoutToastRef.current);
      logoutToastRef.current = null;
    }
  };
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      dismissLogoutToast();
      toast.success("Signed out");
      router.push("/");
    },
    onError: (error) => {
      dismissLogoutToast();
      toast.error(
        error instanceof Error
          ? error.message || "Failed to sign out"
          : "Failed to sign out",
      );
    },
    onMutate: () => {
      dismissLogoutToast();
      logoutToastRef.current = toast.loading("Signing out...");
    },
    onSettled: () => {
      dismissLogoutToast();
    },
  });

  const domainError = getIn(formik.errors, "domain");
  const domainTouched = getIn(formik.touched, "domain");
  const showDomainError =
    typeof domainError === "string" &&
    (formik.submitCount > 0 || Boolean(domainTouched));

  const handleDomainChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const sanitized = raw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    formik.setFieldValue("domain", sanitized);
  };

  return (
    <div className="w-full">
      <section className="mb-6 w-full space-y-6">
        <div className="header">
          <h2>Domain</h2>
          <p className="text-muted-foreground mt-0.5 font-sans text-sm font-normal">
            Choose the username that appears in your public portfolio URL.
          </p>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-full flex flex-col items-start justify-center md:col-span-4">
            <Label htmlFor="settings-domain" className="font-medium">
              Username
            </Label>
            {showDomainError ? (
              <p className="text-destructive mt-2 text-xs">{domainError}</p>
            ) : (
              <p className="text-muted-foreground mt-2 text-xs">
                Only letters and numbers, 3&ndash;32 characters.
              </p>
            )}
          </div>
          <div className="col-span-full flex items-center md:col-span-4">
            <div className="flex w-full items-center rounded">
              <span className="bg-muted text-muted-foreground inline-flex h-9 items-center rounded-s border px-3 text-sm">
                {DOMAIN_PREFIX}/
              </span>
              <Input
                id="settings-domain"
                value={domainValue}
                onChange={handleDomainChange}
                onBlur={() => formik.setFieldTouched("domain", true, false)}
                placeholder="username"
                className={cn(
                  "shadow-none",
                  DOMAIN_PREFIX ? "-ms-px rounded-s-none" : undefined,
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 w-full space-y-6">
        <div className="header">
          <h2>Billing</h2>
          <p className="text-muted-foreground mt-0.5 font-sans text-sm font-normal">
            Keep track of your subscription status.
          </p>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <span className="text-foreground col-span-4 self-center text-sm font-medium">
            Status
          </span>
          <div className="col-span-4 flex items-center justify-end md:col-span-1">
            <span className="w-fit rounded bg-emerald-500/10 px-3 py-1 text-center text-xs font-semibold text-emerald-600 capitalize md:w-full">
              {billingStatus.replace(/-/g, " ")}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <span className="text-foreground col-span-4 self-center text-sm font-medium">
            Type
          </span>
          <div className="col-span-4 flex items-center justify-end md:col-span-1">
            <span className="w-fit rounded bg-zinc-500/10 px-3 py-1 text-center text-xs font-semibold text-zinc-600 capitalize md:w-full">
              {billingType.replace(/-/g, " ")}
            </span>
          </div>
        </div>
      </section>

      <div className="header grid grid-cols-8 gap-4">
        <div className="col-span-full space-y-0.5 md:col-span-5">
          <h2>Live website</h2>
          <p className="text-muted-foreground font-sans text-sm font-normal">
            Visit the public version of your portfolio to confirm changes.
          </p>
        </div>

        <Button
          asChild
          variant="secondary"
          size="sm"
          className="col-span-full w-fit self-center text-xs md:col-span-3 md:ml-auto"
        >
          <Link href={liveSiteHref} target="_blank" rel="noopener noreferrer">
            Live Site
            <PiArrowUpRightBold className="text-muted-foreground ml-2 size-3" />
          </Link>
        </Button>
      </div>

      <div className="header grid grid-cols-8 gap-4 border-t-0">
        <div className="col-span-full space-y-0.5 md:col-span-5">
          <h2>Session</h2>
          <p className="text-muted-foreground font-sans text-sm font-normal">
            Sign out to end your current dashboard session.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          className="col-span-full w-fit self-center bg-red-100 text-red-800 hover:bg-red-100/80 md:col-span-3 md:ml-auto"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          Log out
          <PiSignOutDuotone className="ml-2 size-3 text-red-800" />
        </Button>
      </div>
    </div>
  );
}
