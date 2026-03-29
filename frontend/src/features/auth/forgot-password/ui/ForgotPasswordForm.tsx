"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { requestPasswordReset, resetPassword, verifyPasswordResetCode } from "@/src/shared/api";

type Step = "email" | "code" | "password" | "done";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [debugResetCode, setDebugResetCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (step !== "done" || countdown === null) {
      return;
    }
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          return null;
        }
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown, step]);

  useEffect(() => {
    if (step === "done" && countdown === 0) {
      router.push("/login");
    }
  }, [countdown, router, step]);

  const onRequestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDebugResetCode(null);
    setCode("");
    setVerifiedToken(null);

    const result = await requestPasswordReset({ email });

    if (!result.ok) {
      setErrorMessage(result.error ?? "비밀번호 재설정 요청에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage(result.message ?? "입력하신 이메일로 코드가 전송되었습니다.");
    if (result.resetCode) {
      setDebugResetCode(result.resetCode);
    }
    setStep("code");
    setIsLoading(false);
  };

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await verifyPasswordResetCode({ email, code });
    if (!result.ok || !result.resetToken) {
      setErrorMessage(result.error ?? "코드 인증에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    setVerifiedToken(result.resetToken);
    setSuccessMessage("인증이 완료되었습니다. 새 비밀번호를 입력해주세요.");
    setStep("password");
    setIsLoading(false);
  };

  const onSavePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!verifiedToken) {
      setErrorMessage("인증 정보가 만료되었습니다. 코드를 다시 인증해주세요.");
      setStep("code");
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    const result = await resetPassword({ token: verifiedToken, password });
    if (!result.ok) {
      setErrorMessage(result.error ?? "비밀번호 저장에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage(result.message ?? "비밀번호 변경이 완료되었습니다.");
    setCountdown(5);
    setStep("done");
    setIsLoading(false);
  };

  return (
    <div className="mt-6 space-y-4">
      {step === "email" ? (
        <form onSubmit={onRequestCode} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send reset code"}
          </button>
        </form>
      ) : null}

      {step === "code" ? (
        <form onSubmit={onVerifyCode} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Verification code
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              required
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm tracking-[0.22em] text-slate-900 outline-none transition focus:border-primary"
              placeholder="123456"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      ) : null}

      {step === "password" ? (
        <form onSubmit={onSavePassword} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              placeholder="Enter new password"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirm new password
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              placeholder="Confirm new password"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      ) : null}

      {step === "done" ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <p>
            완료되었습니다. 새 비밀번호로 로그인해주세요.{" "}
            <span className="font-semibold">{countdown}</span>
          </p>
        </div>
      ) : null}

      {debugResetCode ? (
        <p className="text-xs text-slate-500">
          개발 환경 코드: <span className="font-mono">{debugResetCode}</span>
        </p>
      ) : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
    </div>
  );
}
