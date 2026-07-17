"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminSignIn } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    
    try {
      const res = await adminSignIn(data.email, data.password);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Invalid credentials or unauthorized.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-primary p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-text">Gopi Craft-Studio</h1>
          <p className="mt-2 text-sm text-text-muted">Administrator Control Center</p>
        </div>

        {error && (
          <div className="rounded-md bg-error/10 p-4 text-sm text-error text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="e.g. admin@gopicraftstudio.com"
              {...register("email")}
              error={errors.email?.message}
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full h-13 text-base font-semibold"
            loading={loading}
          >
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}
