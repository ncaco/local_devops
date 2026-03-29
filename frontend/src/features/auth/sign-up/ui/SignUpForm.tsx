"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { registerUser } from "@/src/shared/api/auth";
import { useAuthUiStore } from "@/src/features/auth/session";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const { isLoading, errorMessage, setLoading, setError, reset } = useAuthUiStore();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();

    if (!/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(password)) {
      setError("Password must be at least 8 characters and include letters and numbers.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    const result = await registerUser({ email, password, name: name || null });

    if (!result.ok) {
      setError(result.error ?? "Failed to create account.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/login?registered=1");
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
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
          placeholder="Your name"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <span className="relative mt-2 block">
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-slate-300 px-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-primary"
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
      <label className="block text-sm font-medium text-slate-700">
        Confirm password
        <span className="relative mt-2 block">
          <input
            type={isPasswordConfirmVisible ? "text" : "password"}
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-slate-300 px-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setIsPasswordConfirmVisible((prev) => !prev)}
            aria-label={isPasswordConfirmVisible ? "Hide password confirmation" : "Show password confirmation"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {isPasswordConfirmVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </span>
      </label>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isLoading ? "Signing up..." : "Sign up"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Have an account?{" "}
        <Link href="/login" tabIndex={-1} className="font-semibold text-primary hover:opacity-80">
          Sign in
        </Link>
      </p>
    </form>
  );
}
