"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type FormikErrors,
  type FormikHelpers,
  setIn,
  useFormik,
} from "formik";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

import { authApi, authQueryKeys } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirectViaAuthCallback } from "@/lib/auth/callback";
import { DASHBOARD_BASE_PATH } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const registerSchema = z.object({
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

type RegisterFormValues = z.infer<typeof registerSchema>;

const validateWithSchema = (values: RegisterFormValues) => {
  const result = registerSchema.safeParse(values);
  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormikErrors<RegisterFormValues>>(
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

export function RegisterSection() {
  const searchParams = useSearchParams();
  const defaultRedirect = `${DASHBOARD_BASE_PATH}/profile`;
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam?.startsWith("/")
    ? redirectParam
    : defaultRedirect;
  const { data: sessionData } = useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: authApi.getSession,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!sessionData?.session) {
      return;
    }

    redirectViaAuthCallback(sessionData.session, redirectTarget);
  }, [redirectTarget, sessionData]);

  const mutation = useMutation<
    { shouldRedirect: boolean },
    Error,
    RegisterFormValues
  >({
    mutationFn: async ({ email, password }: RegisterFormValues) => {
      const toastId = toast.loading("Creating your account");
      try {
        const supabase = createSupabaseBrowserClient();
        const normalizedEmail = email.trim().toLowerCase();
        const redirectUrl = `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(
          redirectTarget,
        )}`;

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          throw error;
        }

        const requiresEmailConfirmation = !data.session;

        toast.success(
          requiresEmailConfirmation
            ? "Check your email to confirm your account."
            : "Welcome to Linked!",
          { id: toastId },
        );

        if (data.session) {
          redirectViaAuthCallback(data.session, redirectTarget);
          return { shouldRedirect: true };
        }

        return { shouldRedirect: false };
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
          { id: toastId },
        );
        throw error;
      }
    },
    onError: (error) => {
      console.error("[Register Error]", error);
    },
  });

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateWithSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, helpers: FormikHelpers<RegisterFormValues>) => {
      const parsed = registerSchema.safeParse(values);
      if (!parsed.success) {
        helpers.setErrors(validateWithSchema(values));
        helpers.setSubmitting(false);
        return;
      }

      const normalizedValues = {
        email: values.email.trim().toLowerCase(),
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

  const { errors, touched, values } = formik;
  const [oauthProviderLoading, setOauthProviderLoading] = useState<
    "google" | "github" | null
  >(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    const providerLabels: Record<typeof provider, string> = {
      google: "Google",
      github: "GitHub",
    };

    setOauthProviderLoading(provider);
    const toastId = toast.loading(`Redirecting to ${providerLabels[provider]}`);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectUrl = new URL("/api/auth/callback", window.location.origin);
      redirectUrl.searchParams.set("redirect", redirectTarget);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });

      if (error) {
        throw error;
      }

      toast.dismiss(toastId);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to continue with the selected provider. Please try again.",
        { id: toastId },
      );
      setOauthProviderLoading(null);
    }
  };

  return (
    <main className="bg-background text-foreground grid min-h-svh md:grid-cols-2">
      <section className="flex w-full items-center justify-center border-r border-dashed px-6 py-12 md:flex-1 md:px-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Register
            </h1>
            <p className="text-muted-foreground text-sm">
              Start building your portfolio with Linked.
            </p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <p className="mb-1.5 text-sm font-medium">Email</p>
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
                disabled={mutation.isPending}
              />
              {touched.email && errors.email ? (
                <p className="text-destructive text-xs">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="mb-1.5 text-sm font-medium">Password</p>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="********"
                disabled={mutation.isPending}
              />
              {touched.password && errors.password ? (
                <p className="text-destructive text-xs">{errors.password}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending || formik.isSubmitting}
            >
              Register
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
              disabled={
                mutation.isPending ||
                formik.isSubmitting ||
                oauthProviderLoading !== null
              }
              onClick={() => handleOAuthSignIn("google")}
            >
              <FcGoogle className="mr-2 size-4" />
              Continue with Google
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full sm:flex-1"
              disabled={
                mutation.isPending ||
                formik.isSubmitting ||
                oauthProviderLoading !== null
              }
              onClick={() => handleOAuthSignIn("github")}
            >
              <FaGithub className="mr-2 size-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Already have an account?
            </span>
            <Button asChild variant="ghost" size="sm">
              <a href="/auth/login">Log in</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative hidden flex-1 overflow-hidden bg-[#F8F8F8] md:block">
        <Image
          src="/images/showcase.webp"
          alt="Design showcase"
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
