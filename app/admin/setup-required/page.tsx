"use client";

import { AlertCircle, Terminal, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-border bg-primary p-8 shadow-lg">
        {/* Warning Badge Header */}
        <div className="text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-warning/10 text-warning flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl tracking-wide text-text">Database Setup Required</h1>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            The administrator panel cannot be activated because the database credentials are not configured.
          </p>
        </div>

        {/* Steps/Variables required */}
        <div className="rounded-lg border border-border/80 bg-secondary/20 p-5 space-y-4">
          <h2 className="text-xs uppercase font-bold text-accent tracking-wider flex items-center gap-1.5">
            <Terminal className="h-4 w-4" /> Required Environment Variables
          </h2>
          <p className="text-xs text-text-light">
            Please add the following credentials to your server environment configuration (e.g. your <code className="bg-secondary px-1.5 py-0.5 rounded border border-border text-[11px] font-mono">.env</code> file):
          </p>
          
          <ul className="space-y-2 text-xs font-mono">
            <li className="flex items-center justify-between p-2.5 rounded bg-primary border border-border">
              <span className="font-bold text-text-muted">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className="text-[10px] text-error font-semibold">Missing</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded bg-primary border border-border">
              <span className="font-bold text-text-muted">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className="text-[10px] text-error font-semibold">Missing</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded bg-primary border border-border">
              <span className="font-bold text-text-muted">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className="text-[10px] text-error font-semibold">Missing</span>
            </li>
          </ul>
        </div>

        {/* Informative Footer */}
        <div className="space-y-3 pt-2 text-xs text-text-light text-center border-t border-border/80">
          <p>
            Once these variables are set, restart your development server or redeploy to activate the secure admin controls.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="h-10 text-xs font-semibold"
            >
              Check Configuration Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
