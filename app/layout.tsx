import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import KakaoButton from "../components/KakaoButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIBCM 국제선교회 | Not I But Christ",
  description:
    "내가 죽고 예수 그리스도가 사는 삶 — 사도적 세계화의 사명을 감당하는 예수제자공동체를 구축합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}
      >
        <Header />
        {children}
        <Footer />
        <KakaoButton />
      </body>
    </html>
  );
}
