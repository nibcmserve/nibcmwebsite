"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "/",         label: "홈" },
  { href: "/about",    label: "소개" },
  { href: "/ministry", label: "사역" },
  { href: "/news",     label: "소식" },
  { href: "/donate",   label: "후원" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* 로고 */}
        <a href="/" className="flex flex-col">
          <span className="text-2xl font-bold text-blue-950">NIBCM</span>
          <span className="text-xs text-gray-500">Not I But Christ</span>
        </a>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-blue-900 transition">
              {link.label}
            </a>
          ))}
          <a href="/intranet" className="text-blue-700 hover:text-blue-900 transition">
            인트라넷
          </a>
        </nav>

        {/* 데스크탑 CTA */}
        <a
          href="/donate"
          className="hidden md:inline-block bg-blue-950 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
        >
          후원하기
        </a>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="메뉴"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-gray-700 hover:text-blue-900 border-b"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/intranet"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm font-medium text-blue-700 hover:text-blue-900 border-b"
          >
            인트라넷 (선교사 로그인)
          </a>
          <a
            href="/donate"
            onClick={() => setOpen(false)}
            className="block mt-3 bg-blue-950 text-white text-center py-3 rounded-lg text-sm font-semibold"
          >
            후원하기
          </a>
        </div>
      )}
    </header>
  );
}
