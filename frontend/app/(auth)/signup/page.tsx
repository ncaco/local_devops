import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/src/features";

export default function SignUpPage() {
  return (
    <div className="relative grid min-h-screen bg-[#f6f7f9] lg:grid-cols-10">
      <Link href="/" tabIndex={-1} className="absolute top-6 left-6 z-10 flex items-center text-slate-900">
        <Image src="/images/site-logo.svg" alt="SNSAUTO 로고" width={240} height={64} priority className="h-10 w-auto" />
      </Link>
      <section className="flex items-center justify-center bg-white px-8 py-10 lg:col-span-4 lg:px-16">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Get started</h1>
          <p className="mt-2 mb-8 text-sm text-slate-600">Create a new account</p>
          <SignUpForm />
        </div>
      </section>
      <section className="hidden items-center justify-center px-10 py-16 lg:col-span-6 lg:flex">
        <div className="max-w-lg text-slate-800">
          <p className="text-4xl leading-[1.25] tracking-tight">
            SNSAUTO 계정을 만들고 운영 자동화 콘솔을 바로 시작하세요.
          </p>
        </div>
      </section>
    </div>
  );
}

