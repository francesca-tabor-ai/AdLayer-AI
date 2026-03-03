"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast("Account created! Please sign in.", "success");
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          AdLayer <span className="text-primary-600">AI</span>
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Create your account
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
            minLength={8}
          />

          {register.isError && (
            <p className="text-sm text-red-600">
              Registration failed. Email may already be in use.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? <Spinner size="sm" className="text-white" /> : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
