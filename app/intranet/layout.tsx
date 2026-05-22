"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase/client";

const NAV = [
  { href: "/intranet/dashboard",    label: "대시보드",   icon: "🏠" },
  { href: "/intranet/notices",      label: "공지사항",   icon: "📢" },
  { href: "/intranet/documents",    label: "자료실",     icon: "📂" },
  { href: "/intranet/applications", label: "신청하기",   icon: "📝" },
  { href: "/intranet/reports",      label: "보고서 제출", icon: "📊" },
  { href: "/intranet/profile",      label: "내 정보",    icon: "👤" },
];

export default function IntranetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (pathname === "/intranet/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("profiles")
          .select("name")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => {
            if (p?.name) setUserName(p.name);
          });
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/intranet/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* 사이드바 (데스크탑) */}
      <aside className="hidden md:flex flex-col w-56 bg-blue-950 text-white shrink-0 fixed top-0 left-0 h-screen z-30">
        {/* 로고 */}
        <div className="px-6 py-6 border-b border-blue-900">
          <a href="/" className="block">
            <span className="text-xl font-bold">NIBCM</span>
            <p className="text-xs text-blue-400 mt-0.5">선교사 인트라넷</p>
          </a>
        </div>

        {/* 사용자 */}
        {userName && (
          <div className="px-6 py-4 border-b border-blue-900">
            <p className="text-xs text-blue-400">안녕하세요,</p>
            <p className="text-sm font-semibold text-white mt-0.5">{userName} 선교사</p>
          </div>
        )}

        {/* 네비게이션 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? "bg-white/15 text-white" : "text-blue-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* 로그아웃 */}
        <div className="px-3 py-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-300 hover:bg-white/10 hover:text-white transition"
          >
            <span>🚪</span> 로그아웃
          </button>
        </div>
      </aside>

      {/* 모바일 상단 바 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-blue-950 text-white h-14 flex items-center justify-between px-4">
        <a href="/" className="text-lg font-bold">NIBCM 인트라넷</a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-20 bg-blue-950 border-t border-blue-900 px-4 py-3 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-white/10"
            >
              <span>{item.icon}</span> {item.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-300 hover:bg-white/10 mt-2 border-t border-blue-900 pt-4"
          >
            <span>🚪</span> 로그아웃
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
