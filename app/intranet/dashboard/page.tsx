"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Notice { id: string; title: string; is_pinned: boolean; created_at: string; }
interface Application { id: string; title: string; application_type: string; status: string; created_at: string; }

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "접수완료",  color: "bg-gray-100 text-gray-600" },
  reviewing:  { label: "검토중",   color: "bg-blue-100 text-blue-700" },
  approved:   { label: "승인완료",  color: "bg-green-100 text-green-700" },
  rejected:   { label: "반려",     color: "bg-red-100 text-red-600" },
  cancelled:  { label: "취소",     color: "bg-gray-100 text-gray-500" },
  補완요청:   { label: "보완요청",  color: "bg-yellow-100 text-yellow-700" },
};

export default function IntranetDashboard() {
  const [userName, setUserName]   = useState("");
  const [notices, setNotices]     = useState<Notice[]>([]);
  const [myApps, setMyApps]       = useState<Application[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: noticeData }] = await Promise.all([
        supabase.from("profiles").select("name").eq("id", user.id).single(),
        supabase.from("notices").select("id, title, is_pinned, created_at")
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (profile?.name) setUserName(profile.name);
      if (noticeData) setNotices(noticeData);

      // 내 선교사 ID 조회
      const { data: missionary } = await supabase
        .from("missionaries").select("id").eq("user_id", user.id).single();

      if (missionary) {
        const { data: apps } = await supabase
          .from("applications")
          .select("id, title, application_type, status, created_at")
          .eq("missionary_id", missionary.id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (apps) setMyApps(apps);
      }

      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl">

      {/* 환영 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {userName ? `${userName} 선교사님, 안녕하세요 👋` : "안녕하세요 👋"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">NIBCM 선교사 인트라넷입니다.</p>
      </div>

      {/* 빠른 버튼 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: "공지사항",   href: "/intranet/notices",         icon: "📢" },
          { label: "자료실",     href: "/intranet/documents",       icon: "📂" },
          { label: "신청하기",   href: "/intranet/applications/new", icon: "📝" },
          { label: "보고서 제출", href: "/intranet/reports/new",     icon: "📊" },
        ].map((btn) => (
          <a key={btn.href} href={btn.href}
            className="flex flex-col items-center gap-2 bg-white border rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition text-center">
            <span className="text-3xl">{btn.icon}</span>
            <span className="text-sm font-semibold text-gray-700">{btn.label}</span>
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 최근 공지사항 */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">최근 공지사항</h2>
            <a href="/intranet/notices" className="text-xs text-blue-700 hover:underline">전체 보기 →</a>
          </div>
          {notices.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">등록된 공지가 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {notices.map((n) => (
                <li key={n.id}>
                  <a href={`/intranet/notices/${n.id}`} className="flex items-start gap-2 group">
                    {n.is_pinned && (
                      <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5">📌</span>
                    )}
                    <span className="text-sm text-gray-700 group-hover:text-blue-900 line-clamp-1 transition">
                      {n.title}
                    </span>
                  </a>
                  <p className="text-xs text-gray-400 mt-0.5 ml-6">
                    {new Date(n.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 내 신청 현황 */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">내 신청 현황</h2>
            <a href="/intranet/applications" className="text-xs text-blue-700 hover:underline">전체 보기 →</a>
          </div>
          {myApps.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">신청 내역이 없습니다.</p>
              <a href="/intranet/applications/new" className="text-xs text-blue-700 hover:underline mt-2 inline-block">
                신청하기 →
              </a>
            </div>
          ) : (
            <ul className="space-y-3">
              {myApps.map((a) => {
                const s = STATUS_LABEL[a.status] ?? { label: a.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.application_type}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.color}`}>
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
