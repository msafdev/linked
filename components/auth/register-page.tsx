"use client";

import {
  type FormikErrors,
  type FormikHelpers,
  setIn,
  useFormik,
} from "formik";
import { toast } from "sonner";
import { z } from "zod";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authApi } from "@/api";
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

export function RegisterPage() {
  const searchParams = useSearchParams();

  const mutation = useMutation<
    { shouldRedirect: boolean },
    Error,
    RegisterFormValues
  >({
    mutationFn: async ({ email, password }: RegisterFormValues) => {
      const toastId = toast.loading("Creating your account");
      try {
        const normalizedEmail = email.trim().toLowerCase();

        const payload = {
          data: {
            email: normalizedEmail,
            password,
            mode: "register" as const,
          },
        };

        let sessionResponse: Awaited<
          ReturnType<typeof authApi.createSession>
        > | null = null;
        let requiresEmailConfirmation = false;

        try {
          await authApi.put(payload);

          sessionResponse = await authApi.createSession({
            email: normalizedEmail,
            password,
            mode: "register",
          });
        } catch (sessionError) {
          const message =
            sessionError instanceof Error
              ? sessionError.message
              : String(sessionError ?? "");
          const normalizedMessage = message.toLowerCase();
          const needsConfirmation =
            normalizedMessage.includes("email not confirmed") ||
            normalizedMessage.includes("confirm your email");

          if (needsConfirmation) {
            requiresEmailConfirmation = true;
          } else {
            throw sessionError;
          }
        }

        const supabase = createSupabaseBrowserClient();

        if (sessionResponse?.session) {
          const { error } = await supabase.auth.setSession({
            access_token: sessionResponse.session.access_token,
            refresh_token: sessionResponse.session.refresh_token,
          });

          if (error) {
            throw error;
          }
        }

        let authUserData:
          | Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]
          | null = null;

        if (!requiresEmailConfirmation || sessionResponse?.session) {
          const { data, error: authUserError } = await supabase.auth.getUser();

          if (authUserError) {
            throw authUserError;
          }

          authUserData = data;
        }

        toast.success(
          requiresEmailConfirmation
            ? "Check your email to confirm your account."
            : "Welcome to Linked!",
          { id: toastId },
        );

        if (requiresEmailConfirmation) {
          return { shouldRedirect: false };
        }

        if (authUserData?.user) {
          const redirect = searchParams.get("redirect");
          if (redirect) {
            window.location.replace(redirect);
            return { shouldRedirect: true };
          }
        }

        window.location.replace("/dashboard/profile");
        return { shouldRedirect: true };
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
