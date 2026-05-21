"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: "▦" },
  { href: "/admin/missionaries", label: "선교사 관리", icon: "✦" },
  { href: "/admin/applications", label: "신청 관리", icon: "✉" },
  { href: "/admin/news", label: "소식 관리", icon: "📰" },
  { href: "/admin/contacts", label: "문의 관리", icon: "💬" },
  { href: "/admin/documents", label: "문서 관리", icon: "📄" },
  { href: "/admin/reports", label: "보고서 관리", icon: "📊" },
  { href: "/admin/donations", label: "후원 통계", icon: "💛" },
  { href: "/admin/users", label: "사용자 관리", icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 로그인 페이지는 레이아웃 미적용
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드바 */}
      <aside className="w-64 bg-blue-950 text-white min-h-screen flex flex-col">
        {/* 로고 */}
        <div className="px-6 py-7 border-b border-blue-900">
          <h2 className="text-xl font-bold">NIBCM Admin</h2>
          <p className="text-xs text-blue-400 mt-1">Not I But Christ</p>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-blue-200 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* 사용자 정보 + 로그아웃 */}
        <div className="px-6 py-5 border-t border-blue-900">
          {userEmail && (
            <p className="text-xs text-blue-400 mb-3 truncate">{userEmail}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-sm text-blue-300 hover:text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg transition text-left"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <section className="flex-1 overflow-auto">
        {children}
      </section>
    </div>
  );
}
