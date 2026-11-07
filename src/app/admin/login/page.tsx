"use client";

import { useState, useEffect, Suspense } from "react";
import { errorMessage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Lock, Mail, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000;
const STORAGE_KEY_ATTEMPTS = "stg_admin_login_attempts";
const STORAGE_KEY_LOCKOUT = "stg_admin_login_lockout_until";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  // Check rate limit status on mount and count down
  useEffect(() => {
    function checkLockout() {
      const lockoutUntil = localStorage.getItem(STORAGE_KEY_LOCKOUT);
      if (lockoutUntil) {
        const remaining = parseInt(lockoutUntil, 10) - Date.now();
        if (remaining > 0) {
          setLockoutRemaining(Math.ceil(remaining / 1000));
        } else {
          localStorage.removeItem(STORAGE_KEY_LOCKOUT);
          localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
          setLockoutRemaining(null);
        }
      }
    }

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (urlError === "unauthorized") {
      setErrorMessage("Access denied. Your login is valid, but your account is not authorized as an administrator.");
    }
  }, [urlError]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Check if currently locked out
    const lockoutUntil = localStorage.getItem(STORAGE_KEY_LOCKOUT);
    if (lockoutUntil && parseInt(lockoutUntil, 10) > Date.now()) {
      const secondsLeft = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
      setErrorMessage(`Too many failed attempts. Account login is temporarily locked for ${Math.ceil(secondsLeft / 60)} minutes.`);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Record failed attempt
        const attempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10) + 1;
        localStorage.setItem(STORAGE_KEY_ATTEMPTS, attempts.toString());

        if (attempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_MS;
          localStorage.setItem(STORAGE_KEY_LOCKOUT, lockTime.toString());
          setLockoutRemaining(LOCKOUT_MINUTES * 60);
          setErrorMessage(`Too many failed login attempts (${attempts}/${MAX_FAILED_ATTEMPTS}). Locked out for ${LOCKOUT_MINUTES} minutes.`);
        } else {
          setErrorMessage(
            `Invalid email or password. (${MAX_FAILED_ATTEMPTS - attempts} attempts remaining before temporary lockout).`
          );
        }
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage("Unable to authenticate. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Verify that this user is authorized in the admin_users table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        // Log them out immediately if they are not in admin_users
        await supabase.auth.signOut();
        setErrorMessage("Access denied: Your account is not authorized in the admin_users directory.");
        setIsLoading(false);
        return;
      }

      // Successful login: reset failed attempts
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEY_LOCKOUT);

      // Record login timestamp for session timeout tracking
      localStorage.setItem("stg_admin_last_activity", Date.now().toString());

      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      console.error("Login unexpected error:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  }

  const isLockedOut = lockoutRemaining !== null && lockoutRemaining > 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-[#071522] rounded-2xl px-4 py-3 border border-[#0d2238] shadow-lg inline-block max-w-[220px] mx-auto mb-1">
            <img
              src="/brand/logo.png"
              alt="St George Electrical"
              className="w-full h-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </div>
          <h1 className="text-2xl font-black text-[#071522] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Admin Portal
          </h1>
          <p className="text-xs text-slate-500">
            {BUSINESS.name} • Restricted Access
          </p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 text-red-600 mt-0.5" size={18} />
            <div>
              <p className="font-semibold">Security Lockout Active</p>
              <p className="text-xs mt-1 text-red-700">
                Too many incorrect login attempts. Please wait{" "}
                <span className="font-mono font-bold text-[#071522]">
                  {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s
                </span>{" "}
                before attempting to sign in again.
              </p>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && !isLockedOut && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="flex-shrink-0 text-red-600" size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                disabled={isLockedOut || isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stgeorgeelectrical.com.au"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                disabled={isLockedOut || isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLockedOut || isLoading}
            className="btn-primary !w-full !py-3.5 text-sm font-black rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Security & Return Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="hover:text-orange-strong transition-colors">
            ← Return to Website
          </Link>
          <span className="text-[11px] text-slate-400">Session timeout: 30m</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071522] flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-strong" size={32} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
