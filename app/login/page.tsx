"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, AtSign, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-hero-gradient">
      
      <div
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02]"
        style={{ backgroundColor: "#1a3a5c" }}
      ></div>

      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-slate-900/10 p-10 md:p-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Admin Login</h1>
          <p className="text-[15px] font-medium text-slate-500">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="name@labqii.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 hover:bg-slate-100/80 transition-colors border-0 h-[56px] px-5 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <AtSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 hover:bg-slate-100/80 transition-colors border-0 h-[56px] px-5 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 tracking-widest focus:ring-2 focus:ring-slate-200 outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-[13px] font-medium text-rose-600 bg-rose-50 rounded-lg p-4">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] bg-navy hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white text-white rounded-xl text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
