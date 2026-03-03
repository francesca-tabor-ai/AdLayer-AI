"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/dashboard"),
      }
    );
  };

  const fillDemo = () => {
    setEmail("demo@adlayer.ai");
    setPassword("demo2025");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          AdLayer <span className="text-primary-600">AI</span>
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {login.isError && (
            <p className="text-sm text-red-600">
              Invalid email or password
            </p>
          )}

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? <Spinner size="sm" className="text-white" /> : "Sign In"}
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 p-3 rounded-xl bg-accent-purple/5 border border-accent-purple/10">
          <p className="text-xs text-slate-500 text-center mb-1.5">
            <span className="font-semibold text-accent-purple">Demo Account</span>
          </p>
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-600">
            <span>demo@adlayer.ai</span>
            <span className="text-slate-300">/</span>
            <span>demo2025</span>
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={fillDemo}
              className="text-[11px] font-medium text-accent-purple hover:text-accent-purple/80 transition-colors underline underline-offset-2"
            >
              Auto-fill demo credentials
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
