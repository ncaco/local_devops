import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_KR, Sora } from "next/font/google";

import "./globals.css";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNS Deployment System",
  description: "승인, 예약 게시, 실패 복구를 통제하는 SNS 운영 SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${sora.variable} ${notoSansKr.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
