import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/src/features";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen bg-[#f6f7f9] lg:grid-cols-10">
      <Link href="/" tabIndex={-1} className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-900">
        <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} priority className="h-7 w-auto" />
        <span className="text-xl font-semibold">SNSAUTO</span>
      </Link>
      <section className="flex items-center justify-center bg-white px-8 py-10 lg:col-span-4 lg:px-16">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 mb-8 text-sm text-slate-600">Sign in to your account</p>
          <SignInForm />
        </div>
      </section>
      <section className="hidden items-center justify-center px-10 py-16 lg:col-span-6 lg:flex">
        <div className="max-w-lg text-slate-800">
          <p className="text-4xl leading-[1.25] tracking-tight">
            SNSAUTO는 SNS 운영 자동화와 회원 관리를 한 화면에서 처리할 수 있도록 정리된 운영 콘솔입니다.
          </p>
        </div>
      </section>
    </div>
  );
}


