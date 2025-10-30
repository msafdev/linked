"use client";

import type { FormikProps } from "formik";
import { getIn } from "formik";
import { type ChangeEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SectionInitialValuesMap } from "@/lib/schema";
import { SITE_BASE_URL, getLiveSiteUrl } from "@/constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PiArrowUpRightBold } from "react-icons/pi";

type SettingsFormik = FormikProps<SectionInitialValuesMap["settings"]>;

const DOMAIN_PREFIX = SITE_BASE_URL.replace(/^https?:\/\//, "");

export function renderSettingsSection(formik: SettingsFormik): ReactNode {
  const domainValue = formik.values.domain ?? "";
  const billingStatus = formik.values.billingStatus ?? "";
  const displayDomain =
    domainValue && domainValue.length > 0 ? domainValue : "username";

  const liveSiteUrl = getLiveSiteUrl(domainValue);

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
    <div className="space-y-6 w-full">
      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Domain</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Choose the username that appears in your public portfolio URL.
          </p>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <div className="flex flex-col items-start col-span-full md:col-span-3 justify-center">
            <Label htmlFor="settings-domain" className="font-medium">
              Username
            </Label>
            {showDomainError ? (
              <p className="text-xs text-destructive mt-2">{domainError}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Only letters and numbers, 3&ndash;32 characters.
              </p>
            )}
          </div>
          <div className="col-span-full md:col-span-3 flex items-center">
            <div className="flex w-full items-center rounded-md">
              <span className="inline-flex items-center rounded-s-md border bg-muted px-3 text-sm text-muted-foreground h-9">
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
                  DOMAIN_PREFIX ? "-ms-px rounded-s-none" : undefined
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 w-full">
        <div className="header">
          <h2>Billing</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Keep track of your subscription status.
          </p>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <span className="col-span-full md:col-span-3 font-medium text-sm self-center text-foreground">
            Status
          </span>
          <span className="rounded bg-emerald-500/10 px-3 w-fit py-1 text-xs font-semibold capitalize text-emerald-600">
            {billingStatus.replace(/-/g, " ")}
          </span>
        </div>
        <div className="grid grid-cols-8 gap-4">
          <span className="col-span-full md:col-span-3 font-medium text-sm self-center text-foreground">
            Type
          </span>
          <span className="rounded bg-zinc-500/10 px-3 w-fit py-1 text-xs font-semibold capitalize text-zinc-600">
            Trial
          </span>
        </div>
      </section>

      <section className="space-y-6 w-full border-b-2 border-dashed pb-6">
        <div className="header">
          <h2>Live website</h2>
          <p className="text-sm text-muted-foreground font-normal mt-0.5">
            Visit the public version of your portfolio to confirm changes.
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-fit flex items-center"
        >
          <Link href={liveSiteUrl} target="_blank" rel="noopener noreferrer">
            {DOMAIN_PREFIX}/{displayDomain}
            <PiArrowUpRightBold className="ml-2 size-3 text-muted-foreground" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
