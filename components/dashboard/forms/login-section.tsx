"use client";

import {
  type FormikErrors,
  type FormikHelpers,
  setIn,
  useFormik,
} from "formik";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authApi, authQueryKeys } from "@/api";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DASHBOARD_BASE_PATH } from "@/lib/config";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password is too long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const validateWithSchema = (values: LoginFormValues) => {
  const result = loginSchema.safeParse(values);
  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormikErrors<LoginFormValues>>(
    (acc, issue) => {
      if (issue.path.length === 0) {
        return setIn(acc, "_error", issue.message);
      }
      const path = issue.path.join(".");
      return setIn(acc, path, issue.message);
    },
    {},
  );
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function LoginSection() {
  const searchParams = useSearchParams();
  const defaultRedirect = `${DASHBOARD_BASE_PATH}/profile`;
  const redirectTarget = searchParams.get("redirect") || defaultRedirect;
  const { data: sessionData } = useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: authApi.getSession,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (sessionData?.session) {
      window.location.replace(redirectTarget);
    }
  }, [redirectTarget, sessionData]);

  const mutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormValues) => {
      const toastId = toast.loading("Signing you in");
      try {
        const normalizedEmail = normalizeEmail(email);
        await authApi.post({
          data: {
            email: normalizedEmail,
            password,
            mode: "login",
          },
        });

        const sessionResponse = await authApi.createSession({
          email: normalizedEmail,
          password,
          mode: "login",
        });

        if (sessionResponse.session) {
          const supabase = createSupabaseBrowserClient();
          const { error } = await supabase.auth.setSession({
            access_token: sessionResponse.session.access_token,
            refresh_token: sessionResponse.session.refresh_token,
          });

          if (error) {
            throw error;
          }
        }

        toast.success("Welcome back!", { id: toastId });
        return sessionResponse;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to sign you in. Please try again.",
          { id: toastId },
        );
        throw error;
      }
    },
    onSuccess: () => {
      window.location.replace(redirectTarget);
    },
    onError: (error) => {
      console.error("[Login Error]", error);
    },
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateWithSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, helpers: FormikHelpers<LoginFormValues>) => {
      const parsed = loginSchema.safeParse(values);
      if (!parsed.success) {
        helpers.setErrors(validateWithSchema(values));
        helpers.setSubmitting(false);
        return;
      }

      const normalizedValues = {
        email: normalizeEmail(values.email),
        password: values.password,
      };

      helpers.setValues(normalizedValues, false);

      try {
        await mutation.mutateAsync(normalizedValues);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <main className="bg-background text-foreground grid min-h-svh md:grid-cols-2">
      <section className="flex w-full items-center justify-center border-r border-dashed px-6 py-12 md:flex-1 md:px-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Log in
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <p className="mb-1.5 text-sm font-medium">Email</p>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
                disabled={mutation.isPending}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-destructive text-xs">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="mb-1.5 text-sm font-medium">Password</p>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="********"
                disabled={mutation.isPending}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-destructive text-xs">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending || formik.isSubmitting}
            >
              Log in
            </Button>
          </form>

          <div className="text-foreground/40 flex items-center gap-3 text-xs font-medium tracking-wider uppercase">
            <span className="bg-border h-px flex-1" />
            <span>Or</span>
            <span className="bg-border h-px flex-1" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              type="button"
              className="w-full sm:flex-1"
              disabled={mutation.isPending || formik.isSubmitting}
            >
              <FcGoogle className="mr-2 size-4" />
              Continue with Google
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full sm:flex-1"
              disabled={mutation.isPending || formik.isSubmitting}
            >
              <FaGithub className="mr-2 size-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?
            </span>
            <Button asChild variant="ghost" size="sm">
              <a href="/auth/register">Create one</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative hidden flex-1 overflow-hidden bg-[#F8F8F8] md:block">
        <Image
          src="/images/showcase.webp"
          alt="Workspace illustration"
          fill
          priority
          className="object-contain"
          quality={100}
        />
        <div className="from-background/60 to-background/10 pointer-events-none absolute inset-0 bg-gradient-to-r" />
      </section>
    </main>
  );
}
