"use client";

import { useState, useEffect, Suspense } from "react";
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
    } catch (err: any) {
      console.error("Login unexpected error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  }

  const isLockedOut = lockoutRemaining !== null && lockoutRemaining > 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-green/10 border border-green/20 text-green mb-1">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            {BUSINESS.name} • Restricted Access
          </p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 text-red-400 mt-0.5" size={18} />
            <div>
              <p className="font-semibold">Security Lockout Active</p>
              <p className="text-xs mt-1 text-red-300">
                Too many incorrect login attempts. Please wait{" "}
                <span className="font-mono font-bold text-white">
                  {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s
                </span>{" "}
                before attempting to sign in again.
              </p>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && !isLockedOut && (
          <div className="p-3.5 rounded-xl bg-red-900/40 border border-red-700/60 text-red-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="flex-shrink-0 text-red-400" size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLockedOut || isLoading}
            className="w-full py-3 px-4 bg-green hover:bg-green-light text-navy font-bold rounded-lg text-sm transition-colors shadow-lg hover:shadow-green/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200 transition-colors">
            ← Return to Website
          </Link>
          <span className="text-[11px] text-slate-500">Session timeout: 30m</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <Loader2 className="animate-spin text-green" size={32} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
