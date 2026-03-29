"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuthUiStore } from "@/src/features/auth/session";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { isLoading, errorMessage, setLoading, setError, reset } = useAuthUiStore();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        <span className="flex items-center justify-between">
          <span>Password</span>
          <Link href="/forgot-password" tabIndex={-1} className="text-xs font-medium text-primary hover:opacity-80">
            Forgot password?
          </Link>
        </span>
        <span className="relative mt-2 block">
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-slate-300 px-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-primary"
            placeholder="●●●●●●●●"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {isPasswordVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </span>
      </label>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" tabIndex={-1} className="font-semibold text-primary hover:opacity-80">
          Sign up
        </Link>
      </p>
    </form>
  );
}
