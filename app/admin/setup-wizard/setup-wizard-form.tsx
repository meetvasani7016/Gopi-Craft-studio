"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setupSuperAdmin } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const setupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SetupForm = z.infer<typeof setupSchema>;

export default function SetupWizardForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupForm>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = async (data: SetupForm) => {
    setError(null);
    setLoading(true);
    
    try {
      const res = await setupSuperAdmin({
        email: data.email,
        password: data.password,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
          router.refresh();
        }, 3000);
      } else {
        setError(res.error || "Failed to set up Super Admin account.");
      }
    } catch {
      setError("An unexpected error occurred during database setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-primary p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-text">Gopi Craft-Studio</h1>
          <p className="mt-2 text-sm text-text-muted">First-Time Setup Wizard</p>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            Provision Super Admin
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-error/10 p-4 text-sm text-error text-center" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded-md bg-accent/10 p-6 text-sm text-accent text-center space-y-2">
            <h3 className="font-semibold text-base">Super Admin Created Successfully!</h3>
            <p className="text-text-muted text-xs">
              Initializing administrative console. Redirecting to login in 3 seconds...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="space-y-4">
              <Input
                label="Super Admin Email"
                type="email"
                placeholder="e.g. admin@gopicraftstudio.com"
                {...register("email")}
                error={errors.email?.message}
                autoFocus
              />

              <Input
                label="Password (min 8 chars)"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full h-13 text-base font-semibold"
              loading={loading}
            >
              Initialize System & Create Account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
