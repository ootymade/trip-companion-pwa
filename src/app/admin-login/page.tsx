"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin-login/callback` },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-forest">OotyMade admin</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Sign in with your team email. We&apos;ll send a one-tap link — no password to remember.
      </p>

      {status === "sent" ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-foreground-muted">
          Check <strong>{email}</strong> for a sign-in link. You can close this tab.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="block text-sm font-medium text-forest">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base"
              placeholder="you@ootymade.com"
            />
          </label>

          {status === "error" ? <p className="text-sm text-danger">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-md bg-forest px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send sign-in link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-xs text-foreground-muted">
        Only email addresses on OotyMade&apos;s team allow-list can access anything after signing
        in — being able to request a link doesn&apos;t mean you&apos;ll see admin data.
      </p>
    </div>
  );
}
