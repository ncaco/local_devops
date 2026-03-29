import Image from "next/image";
import Link from "next/link";

import { ForgotPasswordForm } from "@/src/features";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f7f9] px-6 py-10">
      <Link href="/" tabIndex={-1} className="absolute top-6 left-6 z-10 flex items-center text-slate-900">
        <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} priority className="h-10 w-auto" />
      </Link>
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600">이메일 입력 후 코드 인증을 완료하면 새 비밀번호를 설정할 수 있습니다.</p>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" tabIndex={-1} className="font-semibold text-slate-900 underline underline-offset-2">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
