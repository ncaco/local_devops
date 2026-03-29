import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthSessionProvider, SiteShell } from "@/src/processes";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNSAUTO | SNS 운영 자동화 관리 콘솔",
  description:
    "SNSAUTO는 SNS 운영 자동화, 회원 관리, 관리자 운영을 위한 통합 콘솔입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <AuthSessionProvider>
          <SiteShell>{children}</SiteShell>
          <Toaster
            position="top-right"
            closeButton={false}
            toastOptions={{
              classNames: {
                toast: "rdd-toast",
                title: "rdd-toast-title",
                description: "rdd-toast-description",
                icon: "rdd-toast-icon",
              },
            }}
          />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
